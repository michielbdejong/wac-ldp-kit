import * as http from 'http'
import Debug from 'debug'
const debug = Debug('app')

import AtomicTree from './AtomicTree'
import { LdpParser, LdpParserResult } from './workers/LdpParser'

import { ContainerReader } from './workers/ContainerReader'
import { GlobReader } from './workers/GlobReader'
import { ResourceReader } from './workers/ResourceReader'
import { ContainerMemberAdder } from './workers/ContainerMemberAdder'
import { ResourceWriter } from './workers/ResourceWriter'
import { ResourceUpdater } from './workers/ResourceUpdater'
import { ContainerDeleter } from './workers/ContainerDeleter'
import { ResourceDeleter } from './workers/ResourceDeleter'

import { ResponderAndReleaser, ResponderAndReleaserTask } from './workers/ResponderAndReleaser'

export default (storage: AtomicTree) => {
  const workers = {
    // step 1, parse:
    parseLdp: new LdpParser(),

    // step 2, execute:
    containerRead: new ContainerReader(storage),
    globRead: new GlobReader(storage),
    resourceRead: new ResourceReader(storage),
    containerDelete: new ContainerDeleter(storage),
    resourceDelete: new ResourceDeleter(storage),
    containerMemberAdd: new ContainerMemberAdder(storage),
    resourceWrite: new ResourceWriter(storage),
    resourceUpdate: new ResourceUpdater(storage),

    // step 3, handle result:
    respondAndRelease: new ResponderAndReleaser()
  }

  const handle = async (req: any, res: any) => {
    debug(`\n\n`, req.method, req.url, req.headers)

    let response: ResponderAndReleaserTask
    try {
      const ldpTask: LdpParserResult = await workers.parseLdp.handle({
        httpReq: req
      })
      debug('parsed', ldpTask)
      response = await workers[ldpTask.ldpTaskName].handle(ldpTask)
      debug('executed', response)
    } catch (error) {
      debug('errored', error)
      response = error as ResponderAndReleaserTask
    }
    response.httpRes = res
    try {
      return workers.respondAndRelease.handle(response)
    } catch (error) {
      debug('errored while responding', error)
    }
  }
  return handle
}

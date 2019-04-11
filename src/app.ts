import * as http from 'http'
import Debug from 'debug'
const debug = Debug('app')

import { AtomicTree } from './AtomicTree'
import { LdpParser, LdpTask } from './workers/LdpParser'

import { ContainerReader } from './workers/ContainerReader'
import { ContainerMemberAdder } from './workers/ContainerMemberAdder'
import { ContainerDeleter } from './workers/ContainerDeleter'

import { GlobReader } from './workers/GlobReader'

import { BlobReader } from './workers/BlobReader'
import { BlobWriter } from './workers/BlobWriter'
import { BlobUpdater } from './workers/BlobUpdater'
import { BlobDeleter } from './workers/BlobDeleter'

import { Responder, LdpResponse } from './workers/Responder'

export default (storage: AtomicTree) => {
  const workers = {
    // step 1, parse:
    parseLdp: new LdpParser(),

    // step 2, execute:
    containerRead: new ContainerReader(storage),
    containerDelete: new ContainerDeleter(storage),
    containerMemberAdd: new ContainerMemberAdder(storage),
    globRead: new GlobReader(storage),
    blobRead: new BlobReader(storage),
    blobWrite: new BlobWriter(storage),
    blobUpdate: new BlobUpdater(storage),
    blobDelete: new BlobDeleter(storage),

    // step 3, handle result:
    respondAndRelease: new Responder()
  }

  const handle = async (req: any, res: any) => {
    debug(`\n\n`, req.method, req.url, req.headers)

    let response: LdpResponse
    try {
      const ldpTask: LdpTask = await workers.parseLdp.process({
        httpReq: req
      })
      debug('parsed', ldpTask)
      response = await workers[ldpTask.ldpTaskName].handle(ldpTask)
      debug('executed', response)
    } catch (error) {
      debug('errored', error)
      response = error as LdpResponse
    }
    response.httpRes = res
    try {
      return workers.respondAndRelease.process(response)
    } catch (error) {
      debug('errored while responding', error)
    }
  }
  return handle
}

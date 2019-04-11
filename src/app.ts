import * as http from 'http'
import Debug from 'debug'
const debug = Debug('app')

import { AtomicTree } from './AtomicTree'
import { LdpParser, LdpTask } from './processors/LdpParser'

import { ContainerReader } from './processors/ContainerReader'
import { ContainerMemberAdder } from './processors/ContainerMemberAdder'
import { ContainerDeleter } from './processors/ContainerDeleter'

import { GlobReader } from './processors/GlobReader'

import { BlobReader } from './processors/BlobReader'
import { BlobWriter } from './processors/BlobWriter'
import { BlobUpdater } from './processors/BlobUpdater'
import { BlobDeleter } from './processors/BlobDeleter'

import { Responder, LdpResponse } from './processors/Responder'
import Processor from './processors/Processor'

export default (storage: AtomicTree) => {
  const processors = {
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
      const ldpTask: LdpTask = await processors.parseLdp.process({
        httpReq: req
      })
      debug('parsed', ldpTask)
      const requestProcessor: Processor = processors[ldpTask.ldpTaskName]
      response = await requestProcessor.process(ldpTask)
      debug('executed', response)
    } catch (error) {
      debug('errored', error)
      response = error as LdpResponse
    }
    response.httpRes = res
    try {
      return processors.respondAndRelease.process(response)
    } catch (error) {
      debug('errored while responding', error)
    }
  }
  return handle
}

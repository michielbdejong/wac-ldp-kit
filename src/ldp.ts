import * as http from 'http'

import { LdpParser } from './workers/LdpParser'

import { ContainerReader } from './workers/ContainerReader'
import { GlobReader } from './workers/GlobReader'
import { ResourceReader } from './workers/ResourceReader'
import { ContainerMemberAdder } from './workers/ContainerMemberAdder'
import { ResourceWriter } from './workers/ResourceWriter'
import { ResourceUpdater } from './workers/ResourceUpdater'
import { ContainerDeleter } from './workers/ContainerDeleter'
import { ResourceDeleter } from './workers/ResourceDeleter'

import { ResponderAndReleaser, ResponderAndReleaserTask } from './workers/ResponderAndReleaser'
import LdpTask from './LdpTask'

const port = 8080

const workers = {
  // step 1, parse:
  parseLdp: new LdpParser(),

  // step 2, execute:
  containerRead: new ContainerReader(),
  globRead: new GlobReader(),
  resourceRead: new ResourceReader(),
  containerDelete: new ContainerDeleter(),
  resourceDelete: new ResourceDeleter(),
  containerMemberAdd: new ContainerMemberAdder(),
  resourceWrite: new ResourceWriter(),
  resourceUpdate: new ResourceUpdater(),

  // step 3, handle result:
  respondAndRelease: new ResponderAndReleaser(),
}

const server = http.createServer(async (req: any, res: any) => {
  console.log(`\n\n`, req.method, req.url, req.headers)

  let response: ResponderAndReleaserTask
  try {
    const ldpTask: LdpTask = await workers.parseLdp.handle({
      httpReq: req
    })
    console.log('parsed', ldpTask)
    response = await workers[ldpTask.ldpTaskName].handle(ldpTask)
    console.log('executed', response)
  } catch (error) {
    console.log('errored', error)
    response = error as ResponderAndReleaserTask
  }
  response.httpRes = res
  workers.respondAndRelease.handle(response)
})

// ...
server.listen(port)
console.log('listening on port', port)

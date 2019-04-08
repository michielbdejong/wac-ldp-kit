import * as http from 'http'

import { LdpParser, LdpParserTask } from './workers/LdpParser'
import { Authentication } from './workers/Authentication'
import { AclFetcher } from './workers/AclFetcher'
import { TrustedAppsListFetcher } from './workers/TrustedAppsListFetcher'
import { AclChecker } from './workers/AclChecker'
import { LdpTaskSplitter } from './workers/LdpTaskSplitter'

import { ContainerReader } from './workers/ContainerReader'
import { GlobReader } from './workers/GlobReader'
import { ResourceReader } from './workers/ResourceReader'
import { ContainerMemberAdder } from './workers/ContainerMemberAdder'
import { ResourceWriter } from './workers/ResourceWriter'
import { ResourceUpdater } from './workers/ResourceUpdater'
import { ContainerDeleter } from './workers/ContainerDeleter'
import { ResourceDeleter } from './workers/ResourceDeleter'

import { ResponderAndReleaser } from './workers/ResponderAndReleaser'

const port = 8080


// parseLdp
//    |
//    v
// determineIdentity
//    |
//    v
// determineAcl
//    |
//    v
// determineTrustedApps
//    |
//    v
// determineAllowedModes
//    |
//    v
// splitToTask
//    |
//     ------------------------------------------------------------------------------------------------------
//     |            |          |             |              |                 |                |             |
//     v            v          v             v              v                 v                v             v
// containerRead globRead resourceRead resourceDelete containerDelete containerMemberAdd resourceWrite resourceUpdate
//     |            |          |             |              |                 |                |             |
//      -----------------------------------------------------------------------------------------------------
//                                                 |
//                                                 V
//                                          respondAndRelease

const workers: any = {}
// see diagram above.
// TODO: allow defining these in any order

// and then all coming back to a single respond-and-release.
workers.respondAndRelease = new ResponderAndReleaser(workers)

workers.containerRead = new ContainerReader({
  done: workers.respondAndRelease
})
workers.globRead = new GlobReader({
  done: workers.respondAndRelease
})
workers.resourceRead = new ResourceReader({
  done: workers.respondAndRelease
})
workers.containerDelete = new ContainerDeleter({
  done: workers.respondAndRelease
})
workers.resourceDelete = new ResourceDeleter({
  done: workers.respondAndRelease
})
workers.containerMemberAdd = new ContainerMemberAdder({
  done: workers.respondAndRelease
})
workers.resourceWrite = new ResourceWriter({
  done: workers.respondAndRelease
})
workers.resourceUpdate = new ResourceUpdater({
  done: workers.respondAndRelease
})

// then split:
workers.splitToTask = new LdpTaskSplitter({
  containerRead: workers.containerRead,
  globRead: workers.globRead,
  resourceRead: workers.resourceRead,
  containerDelete: workers.containerDelete,
  resourceDelete: workers.resourceDelete,
  containerMemberAdd: workers.containerMemberAdd,
  resourceWrite: workers.resourceWrite,
  resourceUpdate: workers.resourceUpdate,
})

workers.determineAllowedModes = new AclChecker({
  success: workers.splitToTask,
  failure: workers.respondAndRelease,
})
workers.determineTrustedApps = new TrustedAppsListFetcher({
  success: workers.determineAllowedModes,
  failure: workers.determineAllowedModes,
})
workers.determineAcl = new AclFetcher({
  success: workers.determineTrustedApps,
  failure: workers.respondAndRelease,
})
workers.determineIdentity = new Authentication({
 success: workers.determineAcl,
 failure: workers.determineAcl,
})

// first steps every http request will go through linearly (unless early error response):
// translate from { req, res } to Request
workers.parseLdp = new LdpParser({
  success: workers.determineIdentity,
  failure: workers.respondAndRelease,
})


const server = http.createServer(async (req: any, res: any) => {
  console.log(`\n\n`, req.method, req.url, req.headers)
  const task = {
    httpReq: req,
    httpRes: res,
  } as LdpParserTask
  workers.parseLdp.post(task)
})

// ...
server.listen(port)
console.log('listening on port', port)

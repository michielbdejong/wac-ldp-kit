import * as http from 'http'
// import Task from './Task'
import { LdpParser, LdpParserTask } from './workers/LdpParser'
import { Authentication } from './workers/Authentication'
import { AclFetcher } from './workers/AclFetcher'
import { TrustedAppsListFetcher } from './workers/TrustedAppsListFetcher'
import { AclChecker } from './workers/AclChecker'
import { ContainerReader } from './workers/ContainerReader'
import { GlobReader } from './workers/GlobReader'
import { ResourceReader } from './workers/ResourceReader'
import { ContainerMemberAdder } from './workers/ContainerMemberAdder'
import { QuotaChecker } from './workers/QuotaChecker'
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
//     -------------------------------------------------------------------
//     |            |          |             |            |               |
//     v            v          v             v            v               v
// containerRead globRead resourceRead resourceDelete containerDelete quotaCheck
//     |            |          |             |            |               |
//     |            |          |             |            |                --------------------------------
//     |            |          |             |            |                |                |              |
//     |            |          |             |            |                v                v              v
//     |            |          |             |            |        containerMemberAdd resourceWrite resourceUpdate
//     |            |          |             |            |                |                |              |
//      ---------------------------------------------------------------------------------------------------
//                                                 |
//                                                 V
//                                          respondAndRelease

const workers: any = {}
// see diagram above.
// first steps every http request will go through linearly (unless early error response):
workers.parseLdp = new LdpParser(workers) // translate from { req, res } to Request
workers.determineIdentity = new Authentication(workers)
workers.determineAcl = new AclFetcher(workers)
workers.determineTrustedApps = new TrustedAppsListFetcher(workers)
workers.determineAllowedModes = new AclChecker(workers)

// then split to:
workers.containerRead = new ContainerReader(workers)
workers.globRead = new GlobReader(workers)
workers.resourceRead = new ResourceReader(workers)
workers.containerDelete = new ContainerDeleter(workers)
workers.resourceDelete = new ResourceDeleter(workers)
workers.quotaCheck = new QuotaChecker(workers)

// and after quotaCheck:
workers.containerMemberAdd = new ContainerMemberAdder(workers)
workers.resourceWrite = new ResourceWriter(workers)
workers.resourceUpdate = new ResourceUpdater(workers)

// and then all coming back to a single respond-and-release.
workers.respondAndRelease = new ResponderAndReleaser(workers)

const server = http.createServer(async (req: any, res: any) => {
  console.log(req.method, req.headers, req.url)
  const task = {
    httpReq: req,
    httpRes: res,
  } as LdpParserTask
  workers.parseLdp.post(task)
})

// ...
server.listen(port)
console.log('listening on port', port)

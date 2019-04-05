import * as http from 'http'
// import Task from './Task'
import { LdpParser, LdpParserTask } from './workers/LdpParser'
// import Authentication from './workers/Authentication'
// import AclFetcher from './workers/AclFetcher'
// import TrustedAppsListFetcher from './workers/TrustedAppsListFetcher'
// import AclChecker from './workers/AclChecker'
// import ContainerReader from './workers/ContainerReader'
// import GlobReader from './workers/GlobReader'
// import ResourceReader from './workers/ResourceReader'
// import ContainerMemberAdder from './workers/ContainerMemberAdder'
// import QuotaChecker from './workers/QuotaChecker'
// import ResourceWriter from './workers/ResourceWriter'
// import ResourceUpdater from './workers/ResourceUpdater'
// import ContainerDeleter from './workers/ContainerDeleter'
// import ResourceDeleter from './workers/ResourceDeleter'
import ResponderAndReleaser from './workers/ResponderAndReleaser'

const port = 8080

const workers: any = {}
  // first steps every http request will go through linearly (unless early error response):
workers.parseLdp = new LdpParser(workers) // translate from { req, res } to Request
  // determineIdentity: new Authentication(workers),
  // determineAcl: new AclFetcher(workers),
  // determineTrustedApps: new TrustedAppsListFetcher(workers),
  // determineAllowedModes: new AclChecker(workers),
  // // then split to:
  // containerRead: new ContainerReader(workers),
  // globRead: new GlobReader(workers),
  // resourceRead: new ResourceReader(workers),
  //
  // containerMemberAdd: new ContainerMemberAdder(workers),
  // quotaCheck: new QuotaChecker(workers),
  // resourceWrite: new ResourceWriter(workers),
  // resourceUpdate: new ResourceUpdater(workers),
  // containerDelete: new ContainerDeleter(workers),
  // resourceDelete: new ResourceDeleter(workers),
  // // and then all coming back to a single respond-and-release.
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

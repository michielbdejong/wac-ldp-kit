import Worker from './Worker'

// Used as:
//  * workers.respondAndRelease
// Receives tasks from:
//  * the LdpParser at workers.parseLdp
//  * the AclChecker at determineAllowedModes
//  * the QuotaChecker at workers.quotaCheck
//
//  * the ContainerReader at containerRead
//  * the GlobReader at workers.globRead
//  * the ResourceReader at workers.resourceRead
//  * the ContainerMemberAdder at workers.containerMemberAdd
//  * the ResourceWriter at workers.resourceWrite
//  * the ResourceUpdater at workers.resourceUpdate
//  * the ContainerDeleter at workers.containerDelete
//  * the ResourceDeleter at workers.resourceDelete

export class ResponderAndReleaserTask {
  errorCode: string
  // TODO: add in fields for successful responses
  httpRes: any
}

export class ResponderAndReleaser extends Worker {
  post(task: ResponderAndReleaserTask) {
    // task.httpRes.writeHead(task.responseStatus, task.responseHeaders)
    // task.responseBody.pipe(task.httpRes)
    // task.httpRes.on('end', () => {
    //   if (task.lock) {
    //     task.lock.release()
    //   }
    // })
  }
}

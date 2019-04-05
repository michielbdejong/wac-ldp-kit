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
  lock: any
}

export class ResponderAndReleaser extends Worker {
  post(task: ResponderAndReleaserTask) {
    console.log('ResponderAndReleaserTask!')
    const responseHeaders = {

    }
    let responseStatus
    if (task.errorCode) {
      responseStatus = 500
    } else {
      responseStatus = 200
    }
    task.httpRes.writeHead(responseStatus, responseHeaders)
    task.httpRes.end('No data')
    // responseBody.pipe(task.httpRes)
    task.httpRes.on('end', () => {
      console.log('request completed')
      if (task.lock) {
        console.log('releasing lock')
        // task.lock.release()
      }
    })
  }
}

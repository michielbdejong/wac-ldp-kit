import Worker from './Worker'
import { TrustedAppsListFetcherResult } from './TrustedAppsListFetcher'
import { ResponderAndReleaserTask } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.determineTrustedApps
// Receives tasks from:
//  * the TrustedAppsListFetcher at determineTrustedApps
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease
//  * the QuotaChecker at workers.quotaCheck
//
//  * the ContainerReader at containerRead
//  * the GlobReader at workers.globRead
//  * the ResourceReader at workers.resourceRead
//  * the ContainerDeleter at workers.containerDelete
//  * the ResourceDeleter at workers.resourceDelete

export class AclCheckerTask extends TrustedAppsListFetcherResult {
}

export class AclCheckerResult extends AclCheckerTask {
}

export class AclChecker extends Worker {
  getAccessError(aclGraph, webId, trustedApps, origin) {
    return null
  }

  post(task: AclCheckerTask) {
    console.log('AclCheckerTask!')
    const accessError = this.getAccessError(task.aclGraph, task.webId, task.trustedApps, task.origin)
    if (accessError !== null) {
      const errorResponse = {
        errorCode: accessError,
        httpRes: task.httpRes,
      } as ResponderAndReleaserTask
      this.colleagues.respondAndRelease.post(errorResponse)
      return
    }
    let nextStep = task.ldpTaskName
    if (task.mayIncreaseDiskUsage) {
      nextStep = 'quotaCheck'
    }
    this.colleagues[nextStep].post(task as LdpTask)
  }
}

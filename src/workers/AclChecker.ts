import Worker from './Worker'
import { TrustedAppsListFetcherResult } from './TrustedAppsListFetcher'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.determineTrustedApps
// Receives tasks from:
//  * the TrustedAppsListFetcher at determineTrustedApps
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease
//  * the LdpTaskSplitter at workers.splitToTask

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
        resultType: ResultType.AccessDenied,
        httpRes: task.httpRes,
      } as ResponderAndReleaserTask
      this.colleagues.failure.post(errorResponse)
      return
    }
    this.colleagues.success.post(task as LdpTask)
  }
}

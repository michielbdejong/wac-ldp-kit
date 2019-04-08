import Worker from './Worker'
import { AclFetcherResult } from './AclFetcher'
import { AclCheckerTask } from './AclChecker'

// Used as:
//  * workers.determineTrustedApps
// Receives tasks from:
//  * the AclFetcher at workers.determineAcl
// Posts tasks to:
//  * the AclChecker at determineAllowedModes

export class TrustedAppsListFetcherTask extends AclFetcherResult {
}

export class TrustedAppsListFetcherResult extends TrustedAppsListFetcherTask {
  trustedApps: any | undefined
}

export class TrustedAppsListFetcher extends Worker {
  post(task: TrustedAppsListFetcherTask) {
    console.log('TrustedAppsListFetcherTask!')
    const result = task as TrustedAppsListFetcherResult // this step just adds info
    result.trustedApps = 'this is where the TrustedAppsListFetcher would create the list of trusted apps'
    this.colleagues.success.post(task as AclCheckerTask)
  }
}

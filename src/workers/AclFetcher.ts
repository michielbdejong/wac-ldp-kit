import Worker from './Worker'
import { AuthenticationResult } from './Authentication'
import { TrustedAppsListFetcherTask } from './TrustedAppsListFetcher'

// Used as:
//  * workers.determineAcl
// Receives tasks from:
//  * the Authentication at workers.determineIdentity
// Posts tasks to:
//  * the TrustedAppsListFetcher at determineTrustedApps

export class AclFetcherTask extends AuthenticationResult {
}

export class AclFetcherResult extends AclFetcherTask {
  aclGraph: any | undefined
}

export class AclFetcher extends Worker {
  post(task: AclFetcherTask) {
    console.log('AclFetcherTask!')
    const result = task as AclFetcherResult // this step just adds info
    result.aclGraph = 'this is where the AclFetcher would create the ACL graph'
    this.colleagues.success.post(task as TrustedAppsListFetcherTask)
  }
}

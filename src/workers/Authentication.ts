import Worker from './Worker'
import { AclFetcherTask } from './AclFetcher'
import { LdpParserTask, LdpParserResult } from './LdpParser'

// Used as:
//  * workers.determineIdentity
// Receives tasks from:
//  * the LdpParser at workers.parseLdp
// Posts tasks to:
//  * the AclFetcher workers.determineAcl

export class AuthenticationTask extends LdpParserResult {
}

export class AuthenticationResult extends AuthenticationTask {
  webId: string | undefined
}

export class Authentication extends Worker {
  post(task: AuthenticationTask) {
    console.log('AuthenticationTask!')
    const result = task as AclFetcherTask // this step just adds info
    result.webId = 'this is where the Authentication module would put the webId'
    this.colleagues.respondAndRelease.post(result)
  }
}

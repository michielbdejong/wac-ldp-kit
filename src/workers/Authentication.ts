import AclFetcherTask from './AclFetcher'
import { LdpParserTask, LdpParserResult } from './LdpParser'

export class AuthenticationTask extends LdpParserResult
}
export class AuthenticationResult extends AuthenticationTask {
  webId: string | undefined
}

export class Authentication extends Worker {
  post(task: AuthenticationTask) {
    this.colleagues.respondAndRelease.post(task as AclFetcherTask)
  }
}

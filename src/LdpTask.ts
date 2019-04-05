import { AclCheckerResult } from './workers/AclChecker'

// Task that can go to one of the LDP-executing workers, or to the QuotaChecker.

export default class LdpTask extends AclCheckerResult {
}

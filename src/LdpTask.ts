import { LdpParserResult } from './workers/LdpParser'

// Task that can go to one of the LDP-executing workers, or to the QuotaChecker.

export default class LdpTask extends LdpParserResult {
}

import Debug from 'debug'
import StorageWorker from './StorageWorker'
import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import { LdpParserResult } from './LdpParser'

const debug = Debug('GlobReader')

export class GlobReader extends StorageWorker implements Worker {
  async handle (task: LdpParserResult) {
    debug('LdpParserResult GlobReader!')
    // TODO: implement
    return {
      resultType: ResultType.OkayWithBody
    } as ResponderAndReleaserTask
  }
}

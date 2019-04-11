import Debug from 'debug'
import StorageWorker from './StorageWorker'
import Processor from './Worker'
import { LdpResponse, ResultType } from './Responder'
import { LdpTask } from './LdpParser'

const debug = Debug('GlobReader')

export class GlobReader extends StorageWorker implements Processor {
  async process (task: LdpTask) {
    debug('LdpParserResult GlobReader!')
    // TODO: implement
    return {
      resultType: ResultType.OkayWithBody
    } as LdpResponse
  }
}

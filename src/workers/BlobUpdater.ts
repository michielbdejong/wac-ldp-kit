import Debug from 'debug'
import StorageWorker from './StorageWorker'
import Processor from './Worker'
import { LdpResponse, ResultType } from './Responder'
import { LdpTask } from './LdpParser'

const debug = Debug('ResourceUpdater')

export class BlobUpdater extends StorageWorker implements Processor {
  async process (task: LdpTask) {
    debug('LdpParserResult ResourceUpdater!')
    // TODO: implement
    return {
      resultType: ResultType.OkayWithoutBody
    } as LdpResponse
  }
}

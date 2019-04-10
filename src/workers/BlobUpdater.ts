import Debug from 'debug'
import StorageWorker from './StorageWorker'
import Worker from './Worker'
import { LdpResponse, ResultType } from './Responder'
import { LdpTask } from './LdpParser'

const debug = Debug('ResourceUpdater')

export class BlobUpdater extends StorageWorker implements Worker {
  async handle (task: LdpTask) {
    debug('LdpParserResult ResourceUpdater!')
    // TODO: implement
    return {
      resultType: ResultType.OkayWithoutBody
    } as LdpResponse
  }
}

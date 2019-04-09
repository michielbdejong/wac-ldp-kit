import Debug from 'debug'
import StorageWorker from './StorageWorker'
import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../LdpTask'

const debug = Debug('ResourceUpdater')

export class ResourceUpdater extends StorageWorker implements Worker {
  async handle (task: LdpTask) {
    debug('LdpTask ResourceUpdater!')
    // TODO: implement
    return {
      resultType: ResultType.OkayWithoutBody
    } as ResponderAndReleaserTask
  }
}

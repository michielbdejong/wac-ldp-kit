import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../LdpTask'

export class ResourceUpdater implements Worker {
  async handle(task: LdpTask) {
    console.log('LdpTask ResourceUpdater!')
    // TODO: implement
    return {
      resultType: ResultType.OkayWithoutBody,
    } as ResponderAndReleaserTask
  }
}

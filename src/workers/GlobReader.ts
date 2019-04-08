import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../LdpTask'

export class GlobReader implements Worker {
  async handle(task: LdpTask) {
    console.log('LdpTask GlobReader!')
    // TODO: implement
    return {
      resultType: ResultType.OkayWithBody,
    } as ResponderAndReleaserTask
  }
}

import Debug from 'debug'
import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../LdpTask'

const debug = Debug('GlobReader')

export class GlobReader implements Worker {
  async handle (task: LdpTask) {
    debug('LdpTask GlobReader!')
    // TODO: implement
    return {
      resultType: ResultType.OkayWithBody
    } as ResponderAndReleaserTask
  }
}

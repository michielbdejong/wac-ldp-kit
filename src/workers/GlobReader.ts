import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.globReader
// Receives tasks from:
//  * the AclChecker at determineAllowedModes
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class GlobReader extends Worker {
  post(task: LdpTask) {
    console.log('LdpTask GlobReader!')
    // TODO: implement
    const result = {
      resultType: ResultType.OkayWithBody,
      httpRes: task.httpRes,
    } as ResponderAndReleaserTask
    this.colleagues.respondAndRelease.post(result)
  }
}

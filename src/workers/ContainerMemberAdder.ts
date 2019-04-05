import Worker from './Worker'
import { ResponderAndReleaserTask } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.containerMemberAdd
// Receives tasks from:
//  * the QuotaChecker at workers.quotaCheck
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class ContainerMemberAdder extends Worker {
  post(task: LdpTask) {
    // TODO: implement
    const result = {
      errorCode: null,
      httpRes: task.httpRes,
    } as ResponderAndReleaserTask
    this.colleagues.respondAndRelease.post(result)
  }
}

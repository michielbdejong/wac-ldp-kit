import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.resourceUpdater
// Receives tasks from:
//  * the QuotaChecker at workers.quotaCheck
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class ResourceUpdater extends Worker {
  post(task: LdpTask) {
    console.log('LdpTask ResourceUpdater!')
    // TODO: implement
    const result = {
      resultType: ResultType.OkayWithoutBody,
      httpRes: task.httpRes,
    } as ResponderAndReleaserTask
    this.colleagues.respondAndRelease.post(result)
  }
}

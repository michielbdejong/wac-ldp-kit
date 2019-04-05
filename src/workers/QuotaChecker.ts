import Worker from './Worker'
import { ResponderAndReleaserTask } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.quotaCheck
// Receives tasks from:
//  * the AclChecker at determineAllowedModes
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease
//  * the ContainerMemberAdder at workers.containerMemberAdd
//  * the ResourceWriter at workers.resourceWrite
//  * the ResourceUpdater at workers.resourceUpdate

export class QuotaChecker extends Worker {
  getQuotaError() {
    return null
  }

  post(task: LdpTask) {
    const quotaError = this.getQuotaError()
    if (quotaError === null) {
      this.colleagues[task.ldpTaskName].post(task as LdpTask)
    } else {
      const errorResponse = {
        errorCode: quotaError,
        httpRes: task.httpRes,
      } as ResponderAndReleaserTask
      this.colleagues.respondAndRelease.post(errorResponse)
    }
  }
}

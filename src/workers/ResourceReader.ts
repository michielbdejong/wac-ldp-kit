import Worker from './Worker'
import { ResponderAndReleaserTask } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.resourceReader
// Receives tasks from:
//  * the AclChecker at determineAllowedModes
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class ResourceReader extends Worker {
  post(task: LdpTask) {
    // TODO: implement
    const result = {
      errorCode: null,
      httpRes: task.httpRes,
    } as ResponderAndReleaserTask
    this.colleagues.respondAndRelease.post(result)
  }
}

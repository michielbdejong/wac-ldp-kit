import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../Task'
console.log('ContainerReader refers to storage')

import storage from '../storage'
import membersListAsResourceData from '../membersListAsResourceData'

// Used as:
//  * workers.containerReader
// Receives tasks from:
//  * the AclChecker at determineAllowedModes
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class ContainerReader extends Worker {
  async post(task: LdpTask) {
    const container = storage.getReadLockedContainer(task.path)
    const membersList = await container.getMembers()
    const resourceData = membersListAsResourceData(task.path, membersList, task.asJsonLd)
    const result = {
      resultType: (task.omitBody ? ResultType.OkayWithoutBody : ResultType.OkayWithBody),
      responseBody: resourceData.body,
      contentType: resourceData.contentType,
      createdLocation: undefined,
      isContainer: task.isContainer,
      httpRes: task.httpRes,
      lock: container,
    } as ResponderAndReleaserTask
    this.colleagues.done.post(result)
  }
}

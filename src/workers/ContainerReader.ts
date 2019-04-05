import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.containerReader
// Receives tasks from:
//  * the AclChecker at determineAllowedModes
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class ContainerReader extends Worker {
  post(task: LdpTask) {
    console.log('LdpTask ContainerReader!')
    // TODO: implement
    const result = {
      resultType: ResultType.OkayWithBody, // TODO: deal with HEAD and OPTIONS
      httpRes: task.httpRes,
    } as ResponderAndReleaserTask
    this.colleagues.respondAndRelease.post(result)
  }
}

  //
  // types.push('<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"')
  // const container = this.storage.getReadLockedContainer(path)
  // const membersList: Array<string> = await container.getMembers()
  // resourceData = membersListAsResourceData(domain + path, membersList, headers)

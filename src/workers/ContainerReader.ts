import Debug from 'debug'
import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../LdpTask'

const debug = Debug('ContainerReader')

import storage from '../storage'
import membersListAsResourceData from '../membersListAsResourceData'

export class ContainerReader implements Worker {
  async handle (task: LdpTask) {
    const container = storage.getReadLockedContainer(task.path)
    const membersList = await container.getMembers()
    const resourceData = membersListAsResourceData(task.path, membersList, task.asJsonLd)
    return {
      resultType: (task.omitBody ? ResultType.OkayWithoutBody : ResultType.OkayWithBody),
      resourceData,
      createdLocation: undefined,
      isContainer: task.isContainer,
      lock: container,
      httpRes: undefined
    } as ResponderAndReleaserTask
  }
}

import Debug from 'debug'
import StorageWorker from './StorageWorker'
import Worker from './Worker'
import { LdpResponse, ResultType } from './Responder'
import { LdpTask } from './LdpParser'
import membersListAsResourceData from '../membersListAsResourceData'

const debug = Debug('ContainerReader')

export class ContainerReader extends StorageWorker implements Worker {
  async handle (task: LdpTask) {
    const container = this.storage.getReadLockedContainer(task.path)
    const membersList = await container.getMembers()
    const resourceData = membersListAsResourceData(task.path, membersList, task.asJsonLd)
    return {
      resultType: (task.omitBody ? ResultType.OkayWithoutBody : ResultType.OkayWithBody),
      resourceData,
      createdLocation: undefined,
      isContainer: task.isContainer,
      lock: container,
      httpRes: undefined
    } as LdpResponse
  }
}

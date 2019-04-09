import * as Debug from 'debug'
import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../LdpTask'
import * as uuid from 'uuid/v4'
import { makeResourceData } from '../ResourceData'
import storage from '../storage'

const debug = Debug('ContainerMemberAdder')

export class ContainerMemberAdder implements Worker {
  async handle(task: LdpTask) {
    debug('LdpTask ContainerMemberAdder!')
    const resourcePath = task.path + uuid()
    const resource = storage.getReadWriteLockedResource(resourcePath)
    if (!resource.exists()) {
      await resource.reset()
      debug('resource.reset has been called')
    }
    await resource.setData(makeResourceData(task.contentType, task.requestBody))
    return {
      resultType: ResultType.Created,
      createdLocation: resourcePath,
    } as ResponderAndReleaserTask
  }
}

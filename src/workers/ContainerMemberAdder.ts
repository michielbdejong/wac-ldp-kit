import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../LdpTask'
import * as uuid from 'uuid/v4'
import { makeResourceData } from '../ResourceData'
import storage from '../storage'

export class ContainerMemberAdder implements Worker {
  async handle(task: LdpTask) {
    console.log('LdpTask ContainerMemberAdder!')
    const resourcePath = task.path + uuid()
    const resource = storage.getReadWriteLockedResource(resourcePath)
    if (!resource.exists()) {
      await resource.reset()
      console.log('resource.reset has been called')
    }
    await resource.setData(makeResourceData(task.contentType, task.requestBody))
    return {
      resultType: ResultType.Created,
      createdLocation: resourcePath,
    } as ResponderAndReleaserTask
  }
}

  //
  // async POST(containerPath: string, headers: any, body: Stream): Promise<Response> {
  //   const resourcePath = containerPath + uuid()
  //   const resource = this.storage.getReadWriteLockedResource(resourcePath)
  //   if (!resource.exists()) {
  //     await resource.reset()
  //   }
  //   const resourceData: ResourceData = {
  //     contentType: headers['Content-Type'],
  //     body: await readStream(body)
  //   }
  //   resource.setData(resourceData)
  //   return new Response(201, { Location: resourcePath }, 'Created')
  // }

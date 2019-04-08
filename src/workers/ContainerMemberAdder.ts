import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../Task'
import * as uuid from 'uuid/v4'
import { makeResourceData } from '../ResourceData'
import storage from '../storage'

// Used as:
//  * workers.containerMemberAdd
// Receives tasks from:
//  * the QuotaChecker at workers.quotaCheck
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class ContainerMemberAdder extends Worker {
  async post(task: LdpTask) {
    console.log('LdpTask ContainerMemberAdder!')
    const resourcePath = task.path + uuid()
    const resource = storage.getReadWriteLockedResource(resourcePath)
    if (!resource.exists()) {
      await resource.reset()
      console.log('resource.reset has been called')
    }
    await resource.setData(makeResourceData(task.contentType, task.requestBody))
    const result = {
      resultType: ResultType.Created,
      httpRes: task.httpRes,
      createdLocation: resourcePath,
    } as ResponderAndReleaserTask
    this.colleagues.done.post(result)
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

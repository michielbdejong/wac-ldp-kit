import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.containerMemberAdd
// Receives tasks from:
//  * the QuotaChecker at workers.quotaCheck
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class ContainerMemberAdder extends Worker {
  post(task: LdpTask) {
    console.log('LdpTask ContainerMemberAdder!')
    // TODO: implement
    const result = {
      resultType: ResultType.OkayWithoutBody,
      httpRes: task.httpRes,
    } as ResponderAndReleaserTask
    this.colleagues.respondAndRelease.post(result)
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

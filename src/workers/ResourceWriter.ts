import Worker from './Worker'
import { ResponderAndReleaserTask } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.resourceWriter
// Receives tasks from:
//  * the QuotaChecker at workers.quotaCheck
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class ResourceWriter extends Worker {
  post(task: LdpTask) {
    // TODO: implement
    const result = {
      errorCode: null,
      httpRes: task.httpRes,
    } as ResponderAndReleaserTask
    this.colleagues.respondAndRelease.post(result)
  }
}

  // async PUT(path: string, headers: any, body: Stream): Promise<Response> {
  //   console.log('checking headers', headers)
  //   if (headers['if-match']) {
  //     const etag = await this.getETag(path)
  //     if (etag !== headers['if-match']) {
  //       console.log(headers, etag, 'no! 412')
  //       return new Response(412, {}, '')
  //     }
  //   }
  //   const resource = this.storage.getReadWriteLockedResource(path)
  //   let status = 200
  //   if (!resource.exists()) {
  //     await resource.reset()
  //     status = 201
  //   }
  //   const resourceData: ResourceData = {
  //     contentType: headers['Content-Type'],
  //     body: await readStream(body)
  //   }
  //   resource.setData(resourceData)
  //   return new Response(status, { 'Content-Type': 'text/plain' }, 'OK')
  // }
  //

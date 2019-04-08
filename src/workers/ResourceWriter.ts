import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../LdpTask'
import storage from '../storage'

export class ResourceWriter implements Worker {
  async handle(task: LdpTask) {
    console.log('LdpTask ResourceWriter!')
    const resource = storage.getReadWriteLockedResource(task.path)
    const resultType = (resource.exists() ? ResultType.OkayWithoutBody : ResultType.Created)
    await resource.setData({
      contentType: task.contentType,
      body: task.requestBody
    })
    resource.releaseLock()

    return {
      resultType,
    } as ResponderAndReleaserTask
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

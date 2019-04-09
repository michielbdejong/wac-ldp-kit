import Debug from 'debug'
import StorageWorker from './StorageWorker'
import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import { LdpParserResult } from './LdpParser'

const debug = Debug('ResourceWriter')

export class ResourceWriter extends StorageWorker implements Worker {
  async handle (task: LdpParserResult) {
    debug('LdpParserResult ResourceWriter!')
    const resource = this.storage.getReadWriteLockedResource(task.path)
    // FIXME: duplicate code qith ResourceWriter. use inheritence with common ancestor?
    if(task.ifMatch) {
      const resourceData = await resource.getData()
      if (resourceData.etag !== task.ifMatch) {
        return {
          resultType: ResultType.PreconditionFailed,
        } as ResponderAndReleaserTask
      }
    }
    const resultType = (resource.exists() ? ResultType.OkayWithoutBody : ResultType.Created)
    await resource.setData({
      contentType: task.contentType,
      body: task.requestBody
    })
    resource.releaseLock()

    return {
      resultType
    } as ResponderAndReleaserTask
  }
}

  // async PUT(path: string, headers: any, body: Stream): Promise<Response> {
  //   debug('checking headers', headers)
  //   if (headers['if-match']) {
  //     const etag = await this.getETag(path)
  //     if (etag !== headers['if-match']) {
  //       debug(headers, etag, 'no! 412')
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

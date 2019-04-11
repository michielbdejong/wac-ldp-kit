import Debug from 'debug'
import StorageProcessor from './StorageProcessor'
import Processor from './Processor'
import { LdpResponse, ResultType } from './Responder'
import { LdpTask } from './LdpParser'

const debug = Debug('ResourceDeleter')

export class BlobDeleter extends StorageProcessor implements Processor {
  async process (task: LdpTask) {
    debug('LdpParserResult ResourceDeleter!')
    const resource = this.storage.getBlob(task.path)
    // FIXME: duplicate code qith ResourceWriter. use inheritence with common ancestor?
    if (task.ifMatch) {
      const resourceData = await resource.getData()
      if (resourceData.etag !== task.ifMatch) {
        return {
          resultType: ResultType.PreconditionFailed
        } as LdpResponse
      }
    }
    await resource.delete()
    return {
      resultType: ResultType.OkayWithoutBody
    } as LdpResponse
  }
}

  //
  // async DELETE(path: string, headers: any): Promise<Response> {
  //   if (headers['If-Match'] && this.getETag(path) !== headers['If-Match']) {
  //     return new Response(412, {}, '')
  //   }
  //   let readWriteLockedNode: ReadWriteLockedNode
  //   if (path.substr(-1) === '/') {
  //     readWriteLockedNode = this.storage.getReadWriteLockedContainer(path)
  //   } else {
  //     readWriteLockedNode = this.storage.getReadWriteLockedResource(path)
  //   }
  //   await readWriteLockedNode.delete()
  //   debug('deleted', path)
  //   return new Response(200, { 'Content-Type': 'text/plain' }, 'Deleted')
  // }

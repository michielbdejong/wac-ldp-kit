import Debug from 'debug'
import StorageWorker from './StorageWorker'
import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import { LdpParserResult } from './LdpParser'

const debug = Debug('ResourceDeleter')

export class ResourceDeleter extends StorageWorker implements Worker {
  async handle (task: LdpParserResult) {
    debug('LdpParserResult ResourceDeleter!')
    const resource = await this.storage.getReadWriteLockedResource(task.path)
    // FIXME: duplicate code qith ResourceWriter. use inheritence with common ancestor?
    if(task.ifMatch) {
      const resourceData = await resource.getData()
      if (resourceData.etag !== task.ifMatch) {
        return {
          resultType: ResultType.PreconditionFailed,
        } as ResponderAndReleaserTask
      }
    }
    resource.delete()
    resource.releaseLock()
    return {
      resultType: ResultType.OkayWithoutBody
    } as ResponderAndReleaserTask
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

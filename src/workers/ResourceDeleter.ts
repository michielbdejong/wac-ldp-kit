import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../LdpTask'

export class ResourceDeleter implements Worker {
  async handle(task: LdpTask) {
    console.log('LdpTask ResourceDeleter!')
    // TODO: implement
    return {
      resultType: ResultType.OkayWithoutBody,
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
  //   console.log('deleted', path)
  //   return new Response(200, { 'Content-Type': 'text/plain' }, 'Deleted')
  // }

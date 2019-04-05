import Worker from './Worker'
import { ResponderAndReleaserTask } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.resourceDelete
// Receives tasks from:
//  * the AclChecker at determineAllowedModes
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class ResourceDeleter extends Worker {
  post(task: LdpTask) {
    console.log('LdpTask ResourceDeleter!')
    // TODO: implement
    const result = {
      errorCode: null,
      httpRes: task.httpRes,
    } as ResponderAndReleaserTask
    this.colleagues.respondAndRelease.post(result)
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

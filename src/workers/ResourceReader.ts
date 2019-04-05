import Worker from './Worker'
import { ResponderAndReleaserTask } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.resourceReader
// Receives tasks from:
//  * the AclChecker at determineAllowedModes
// Posts tasks to:
//  * the ResponderAndReleaser at workers.respondAndRelease

export class ResourceReader extends Worker {
  post(task: LdpTask) {
    console.log('LdpTask ResourceReader!')
    // TODO: implement
    const result = {
      errorCode: null,
      httpRes: task.httpRes,
    } as ResponderAndReleaserTask
    this.colleagues.respondAndRelease.post(result)
  }
}

// import AtomicTree from './Atomictree'
// import { ReadLockedNode, ReadWriteLockedNode } from './Node'
// import { ReadLockedContainer, ReadWriteLockedContainer } from './Container'
// import { ReadLockedResource, ReadWriteLockedResource } from './Resource'
// import membersListAsResourceData from './membersListAsResourceData'
// import Request from './Request'
// // import Response from './Response'
// import ResourceData from './ResourceData'
// import * as Stream from 'stream'
// import sha256 from './sha256'
// import * as uuid from 'uuid/v4'
//
// function readStream(stream: Stream): Promise<string> {
//   return new Promise(resolve => {
//     let text = ''
//     stream.on('data', chunk => {
//       text += chunk
//     })
//     stream.on('end', () => {
//       resolve(text)
//     })
//   })
// }
  //
  // async getResourceData(path:string): Promise<ResourceData> {
  //   const resource = this.storage.getReadLockedResource(path)
  //   if (resource.exists()) {
  //     const resourceData = await resource.getData()
  //     resource.releaseLock()
  //     return resourceData
  //   }
  //   resource.releaseLock()
  //   return {
  //     contentType: 'application/octet-stream',
  //     body: '',
  //   } as ResourceData
  // }
  //
  // calculateETag(resourceData: ResourceData): string {
  //   return sha256(resourceData.body)
  // }
  //
  // async getETag(path: string): Promise<string> {
  //   const resourceData = await this.getResourceData(path)
  //   return `"${this.calculateETag(resourceData)}"`
  // }
  //
  // async GET(path: string, headers: any, body: Stream.Readable, domain: string): Promise<Response> {
  //   let types: Array<string> = [
  //     '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
  //   ]
  //   let resourceData
  //   if (path.substr(-1) == '/') {
  //   } else {
  //     resourceData = await this.getResourceData(path)
  //   }
  //   let etag = sha256(resourceData.body)
  //   const header = {
  //     'Content-Type': resourceData.contentType,
  //     'Link': `<.acl>; rel="acl", <.meta>; rel="describedBy", ${types.join(', ')}`,
  //     'Allow': 'GET, HEAD, POST, PUT, DELETE, PATCH',
  //     'Accept-Patch': 'application/sparql-update',
  //     'Accept-Post': 'application/sparql-update',
  //     'ETag': `"${etag}"`,
  //   }
  //   return new Response(200, headers, body)
  // }
  //
  // async HEAD(path: string, headers: any, body: Stream.Readable, domain: string): Promise<Response> {
  //   const response = await this.GET(path, headers, body, domain)
  //   response.setBody('')
  //   return response
  // }
  //
  // async OPTIONS(path: string, headers: any, body: Stream.Readable, domain: string): Promise<Response> {
  //   return this.HEAD(path, headers, body, domain)
  // }

// import AtomicTree from './Atomictree'
// import { ReadLockedNode, ReadWriteLockedNode } from './Node'
// import { ReadLockedContainer, ReadWriteLockedContainer } from './Container'
// import { ReadLockedResource, ReadWriteLockedResource } from './Resource'
// import membersListAsResourceData from './membersListAsResourceData'
// import Request from './Request'
// import Response from './Response'
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

import Worker from './Worker'
// import { HttpRequest, HttpResponse } from 'http'

// parse the http request to extract some basic info (e.g. is it a container?)
// and add that info to the request, then pass it on to the colleague from
// Authentication:
export class LdpParser extends Worker {
  determineIsContainer(task: LdpParserTask) {
    return (task.httpReq.url.substr(-1) === '/')
  }

  post(task: LdpParserTask) {
    const parsedTask = task as any
    parsedTask.isContainer = this.determineIsContainer(task)
    this.colleagues.respondAndRelease.post(parsedTask)
  }
}

export class LdpParserTask {
  httpReq: any // HttpRequest
  httpRes: any // HttpResponse
}

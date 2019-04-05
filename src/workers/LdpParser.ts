// Used as:
//  * workers.parseLdp
// Receives tasks from:
//  * the ldp.ts as they come in to the http server.
// Posts tasks to:
//  * the Authentication at workers.determineIdentity
//  * the ResponderAndReleaser at workers.respondAndRelease

import Worker from './Worker'
import { ResponderAndReleaserTask } from './ResponderAndReleaser'

// import { HttpRequest, HttpResponse } from 'http'

// parse the http request to extract some basic info (e.g. is it a container?)
// and add that info to the request, then pass it on to the colleague from
// Authentication:
export class LdpParser extends Worker {
  determineIsContainer(httpReq: any) {
    return (httpReq.url.substr(-1) === '/')
  }

  determineLdpTaskName(httpReq: any) {
    return 'containerRead' // todo: implement
  }

  determineOrigin(httpReq: any) {
    return httpReq.headers.origin
  }

  determineMayIncreaseDiskUsage(httpReq: any) {
    return (['OPTIONS', 'HEAD', 'GET', 'DELETE'].indexOf(httpReq.method) === -1)
  }

  post(task: LdpParserTask) {
    let errorCode = null // todo actually use this. maybe with try-catch?
    const parsedTask = {
      isContainer: this.determineIsContainer(task.httpReq),
      mayIncreaseDiskUsage: this.determineMayIncreaseDiskUsage(task.httpReq),
      origin: this.determineOrigin(task.httpReq),
      ldpTaskName: this.determineLdpTaskName(task.httpReq),
      httpRes: task.httpRes, // passed on
    } as LdpParserResult

    if (errorCode === null) {
      this.colleagues.determineIdentity.post(parsedTask)
    } else {
      const errorResponse = {
        errorCode: 'could not parse request',
        httpRes: task.httpRes,
      } as ResponderAndReleaserTask
      this.colleagues.respondAndRelease.post(errorResponse)
    }
  }
}

export class LdpParserResult {
  isContainer: boolean
  mayIncreaseDiskUsage: boolean
  origin: string
  ldpTaskName: string
  httpRes: any // HttpResponse
}

export class LdpParserTask {
  httpReq: any // HttpRequest
  httpRes: any // HttpResponse
}

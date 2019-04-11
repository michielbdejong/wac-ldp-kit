import * as http from 'http'
import Debug from 'debug'
import Processor from './Processor'
import { LdpResponse, ResultType, ErrorResult } from './Responder'
import { Path } from '../AtomicTree'

const debug = Debug('LdpParser')

// parse the http request to extract some basic info (e.g. is it a container?)
// and add that info to the request, then pass it on to the colleague from
// Authentication:
export class LdpParser implements Processor {
  getContainerTask (method: string) {
    if (method === 'OPTIONS' || method === 'HEAD' || method === 'GET') {
      return 'containerRead'
    }
    if (method === 'POST' || method === 'PUT') {
      return 'containerMemberAdd'
    }
    if (method === 'DELETE') {
      return 'containerDelete'
    }
    return 'unknown'
  }

  getGlobTask (method: string) {
    if (method === 'OPTIONS' || method === 'HEAD' || method === 'GET') {
      return 'globRead'
    }
    return 'unknown'
  }

  getBlobTask (method: string) {
    if (method === 'OPTIONS' || method === 'HEAD' || method === 'GET') {
      return 'blobRead'
    }
    if (method === 'PUT') {
      return 'blobWrite'
    }
    if (method === 'PUT') {
      return 'blobUpdate'
    }
    if (method === 'DELETE') {
      return 'blobDelete'
    }
    debug('unknown http method', method)
    return 'unknown'
  }

  determineLdpParserResultName (httpReq: http.IncomingMessage) {
    // if the URL end with a / then the path indicates a container
    // if the URL end with /* then the path indicates a glob
    // in all other cases, the path indicates a blob

    const lastUrlChar = httpReq.url.substr(-1)
    if (lastUrlChar === '/') {
      return this.getContainerTask(httpReq.method)
    } else if (lastUrlChar === '*') {
      return this.getGlobTask(httpReq.method)
    } else {
      return this.getBlobTask(httpReq.method)
    }
    return 'containerRead' // todo: implement
  }

  determineOrigin (httpReq: http.IncomingMessage) {
    return httpReq.headers.origin
  }

  determineContentType (httpReq: http.IncomingMessage) {
    return httpReq.headers['content-type']
  }

  determineIfMatch (httpReq: http.IncomingMessage) {
    try {
      return httpReq.headers['if-match'].split('"')[1]
    } catch (error) {
      // return undefined
    }
  }

  determineIfNoneMatch (httpReq: http.IncomingMessage) {
    try {
      return httpReq.headers['if-none-match'].split(',').map(x => x.split('"')[1])
    } catch (error) {
      // return undefined
    }
  }

  determineMayIncreaseDiskUsage (httpReq: http.IncomingMessage) {
    return (['OPTIONS', 'HEAD', 'GET', 'DELETE'].indexOf(httpReq.method) === -1)
  }

  determineOmitBody (httpReq: http.IncomingMessage) {
    return (['OPTIONS', 'HEAD'].indexOf(httpReq.method) !== -1)
  }

  determineAsJsonLd (httpReq: http.IncomingMessage) {
    try {
      return (httpReq.headers['content-type'].split(';')[0] === 'application/json+ld')
    } catch (e) {
      return false
    }
  }

  async process (httpReq: http.IncomingMessage) {
    debug('LdpParserTask!')
    let errorCode = null // todo actually use this. maybe with try-catch?
    const parsedTask = {
      mayIncreaseDiskUsage: this.determineMayIncreaseDiskUsage(httpReq),
      omitBody: this.determineOmitBody(httpReq),
      isContainer: (httpReq.url.substr(-1) === '/'), // FIXME: code duplication, see determineLdpParserResultName above
      origin: this.determineOrigin(httpReq),
      contentType: this.determineContentType(httpReq),
      ifMatch: this.determineIfMatch(httpReq),
      ifNoneMatch: this.determineIfNoneMatch(httpReq),
      asJsonLd: this.determineAsJsonLd(httpReq),
      ldpTaskName: this.determineLdpParserResultName(httpReq),
      requestBody: undefined,
      path: new Path(httpReq.url)
    } as LdpTask
    await new Promise(resolve => {
      parsedTask.requestBody = ''
      httpReq.on('data', chunk => {
        parsedTask.requestBody += chunk
      })
      httpReq.on('end', resolve)
    })
    debug('parsed http request', {
      method: httpReq.method,
      headers: httpReq.headers,
      mayIncreaseDiskUsage: parsedTask.mayIncreaseDiskUsage,
      omitBody: parsedTask.omitBody,
      isContainer: parsedTask.isContainer,
      origin: parsedTask.origin,
      ldpTaskName: parsedTask.ldpTaskName,
      path: parsedTask.path,
      requestBody: parsedTask.requestBody
    })
    if (errorCode === null) {
      return parsedTask
    } else {
      throw new ErrorResult(ResultType.CouldNotParse)
    }
  }
}

export class LdpTask {
  mayIncreaseDiskUsage: boolean
  isContainer: boolean
  omitBody: boolean
  asJsonLd: boolean
  origin: string
  contentType: string | undefined
  ifMatch: string | undefined
  ldpTaskName: string
  path: Path
  requestBody: string
}

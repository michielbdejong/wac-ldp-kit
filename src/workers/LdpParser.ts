import Debug from 'debug'
import Processor from './Worker'
import { LdpResponse, ResultType, ErrorResult } from './Responder'
import { Path } from '../AtomicTree'

const debug = Debug('LdpParser')

// parse the http request to extract some basic info (e.g. is it a container?)
// and add that info to the request, then pass it on to the colleague from
// Authentication:
export class LdpParser implements Processor {
  getContainerTask (method) {
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

  getGlobTask (method) {
    if (method === 'OPTIONS' || method === 'HEAD' || method === 'GET') {
      return 'globRead'
    }
    return 'unknown'
  }

  getBlobTask (method) {
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

  determineLdpParserResultName (httpReq: any) {
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

  determineOrigin (httpReq: any) {
    return httpReq.headers.origin
  }

  determineContentType (httpReq: any) {
    return httpReq.headers['content-type']
  }

  determineIfMatch (httpReq: any) {
    try {
      return httpReq.headers['if-match'].split('"')[1]
    } catch (error) {
      // return undefined
    }
  }

  determineIfNoneMatch (httpReq: any) {
    try {
      return httpReq.headers['if-none-match'].split(',').map(x => x.split('"')[1])
    } catch (error) {
      // return undefined
    }
  }

  determineMayIncreaseDiskUsage (httpReq: any) {
    return (['OPTIONS', 'HEAD', 'GET', 'DELETE'].indexOf(httpReq.method) === -1)
  }

  determineOmitBody (httpReq: any) {
    return (['OPTIONS', 'HEAD'].indexOf(httpReq.method) !== -1)
  }

  determineAsJsonLd (httpReq: any) {
    try {
      return (httpReq.headers['content-type'].split(';')[0] === 'application/json+ld')
    } catch (e) {
      return false
    }
  }

  async process (task: any) {
    debug('LdpParserTask!')
    let errorCode = null // todo actually use this. maybe with try-catch?
    const parsedTask = {
      mayIncreaseDiskUsage: this.determineMayIncreaseDiskUsage(task.httpReq),
      omitBody: this.determineOmitBody(task.httpReq),
      isContainer: (task.httpReq.url.substr(-1) === '/'), // FIXME: code duplication, see determineLdpParserResultName above
      origin: this.determineOrigin(task.httpReq),
      contentType: this.determineContentType(task.httpReq),
      ifMatch: this.determineIfMatch(task.httpReq),
      ifNoneMatch: this.determineIfNoneMatch(task.httpReq),
      asJsonLd: this.determineAsJsonLd(task.httpReq),
      ldpTaskName: this.determineLdpParserResultName(task.httpReq),
      requestBody: undefined,
      path: new Path(task.httpReq.url)
    } as LdpTask
    await new Promise(resolve => {
      parsedTask.requestBody = ''
      task.httpReq.on('data', chunk => {
        parsedTask.requestBody += chunk
      })
      task.httpReq.on('end', resolve)
    })
    debug('parsed http request', {
      method: task.httpReq.method,
      headers: task.httpReq.headers,
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

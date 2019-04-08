import Worker from './Worker'
import { ReadLockedNode } from '../Node'
import { ResourceData } from '../ResourceData'

export enum ResultType {
  CouldNotParse,
  AccessDenied,
  NotFound,
  QuotaExceeded,
  OkayWithBody,
  OkayWithoutBody,
  Created,
  InternalServerError,
}

export class ErrorResult extends Error {
  resultType: ResultType
  constructor(resultType: ResultType) {
    super('error result')
    this.resultType = resultType
  }
}
export class ResponderAndReleaserTask {
  resultType: ResultType
  resourceData: ResourceData | undefined
  createdLocation: string | undefined
  isContainer: boolean
  httpRes: any
  lock: ReadLockedNode | undefined
}

export class ResponderAndReleaser implements Worker {
  async handle(task: ResponderAndReleaserTask) {
    console.log('ResponderAndReleaserTask!')

    const responses = {
      [ResultType.OkayWithBody]: {
        responseStatus: 200,
        responseBody: task.resourceData ? task.resourceData.body : '',
      },
      [ResultType.CouldNotParse]: {
        responseStatus: 405,
        responseBody: 'Method not allowed',
      },
      [ResultType.AccessDenied]: {
        responseStatus: 401,
        responseBody: 'Access denied',
      },
      [ResultType.NotFound]: {
        responseStatus: 404,
        responseBody: 'Not found',
      },
      [ResultType.Created]: {
        responseStatus: 201,
        responseBody: 'Created',
      },
      [ResultType.OkayWithoutBody]: {
        responseStatus: 204,
        responseBody: 'No Content',
      },
      [ResultType.InternalServerError]: {
        responseStatus: 500,
        responseBody: 'Internal server error',
      }
    }
    console.log(task.resultType, responses)
    const responseStatus = responses[task.resultType].responseStatus
    const responseBody = responses[task.resultType].responseBody

    const types: Array<string> = [
      '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
    ]
    if (task.isContainer) {
       types.push('<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"')
    }
    const responseHeaders = {
      'Link': `<.acl>; rel="acl", <.meta>; rel="describedBy", ${types.join(', ')}`,
      'Allow': 'GET, HEAD, POST, PUT, DELETE, PATCH',
      'Accept-Patch': 'application/sparql-update',
      'Accept-Post': 'application/sparql-update',
    } as any
    if (task.resourceData) {
      responseHeaders['Content-Type'] = task.resourceData.contentType
    }
    if (task.createdLocation) {
      responseHeaders['Location'] = task.createdLocation
    }
    if (task.resourceData) {
      console.log('setting ETag')
      responseHeaders.ETag = `"${task.resourceData.etag}"`
    } else {
      console.log('not setting ETag')
    }

    console.log('responding', { responseStatus, responseHeaders, responseBody })
    task.httpRes.writeHead(responseStatus, responseHeaders)
    task.httpRes.end(responseBody)
    task.httpRes.on('end', () => {
      console.log('request completed')
      if (task.lock) {
        console.log('releasing lock')
        task.lock.releaseLock()
      }
    })
  }
}

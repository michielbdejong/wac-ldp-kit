import Worker from './Worker'
import { ReadLockedNode } from '../Node'
import sha256 from '../sha256'

// Used as:
//  * workers.respondAndRelease
// Receives tasks from:
//  * the LdpParser at workers.parseLdp
//  * the AclChecker at determineAllowedModes
//  * the QuotaChecker at workers.quotaCheck
//
//  * the ContainerReader at containerRead
//  * the GlobReader at workers.globRead
//  * the ResourceReader at workers.resourceRead
//  * the ContainerMemberAdder at workers.containerMemberAdd
//  * the ResourceWriter at workers.resourceWrite
//  * the ResourceUpdater at workers.resourceUpdate
//  * the ContainerDeleter at workers.containerDelete
//  * the ResourceDeleter at workers.resourceDelete

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

export class ResponderAndReleaserTask {
  resultType: ResultType
  contentType: string
  responseBody: string | null
  createdLocation: string | undefined
  isContainer: boolean
  httpRes: any
  lock: ReadLockedNode | undefined
}

export class ResponderAndReleaser extends Worker {
  post(task: ResponderAndReleaserTask) {
    console.log('ResponderAndReleaserTask!')

    const responses = {
      [ResultType.OkayWithBody]: {
        responseStatus: 200,
        responseBody: task.responseBody,
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
    if (task.contentType) {
      responseHeaders['Content-Type'] = task.contentType
    }
    if (task.createdLocation) {
      responseHeaders['Location'] = task.createdLocation
    }
    if (task.responseBody) {
      console.log('setting ETag')
      responseHeaders.ETag = `"${sha256(task.responseBody)}"`
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

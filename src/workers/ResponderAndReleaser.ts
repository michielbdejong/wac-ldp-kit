import Worker from './Worker'
import { ReadLockedNode } from '../Node'
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
}

export class ResponderAndReleaserTask {
  resultType: ResultType
  contentType: string
  responseBody: string | null
  etag: string | null
  createdLocation: string | null
  httpRes: any
  lock: ReadLockedNode | undefined
}

export class ResponderAndReleaser extends Worker {
  post(task: ResponderAndReleaserTask) {
    console.log('ResponderAndReleaserTask!')
    const responseHeaders = {
    }
    if (task.contentType) {
      responseHeaders['Content-Type'] = task.contentType
    }
    let responseStatus
    let responseBody
    switch (task.resultType) {
    case ResultType.CouldNotParse:
      responseStatus = 405
      responseBody = 'Method not allowed'
      break
    case ResultType.AccessDenied:
      responseStatus = 401
      responseBody = 'Access denied'
      break
    case ResultType.NotFound:
      responseStatus = 404
      responseBody = 'Not found'
      break
    case ResultType.Created:
      responseStatus = 201
      responseBody = 'Created'
      responseHeaders['Location'] = task.createdLocation
      break
    case ResultType.OkayWithoutBody:
      responseStatus = 204
      responseBody = 'No Content'
      break
    case ResultType.OkayWithBody:
      responseStatus = 200
      responseBody = task.responseBody
      break
    default:
      responseStatus = 500
      responseBody = 'Internal server error'
    }
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

import AtomicTree from './Atomictree'
import { ReadLockedNode, ReadWriteLockedNode } from './Node'
import { ReadLockedContainer, ReadWriteLockedContainer } from './Container'
import { ReadLockedResource, ReadWriteLockedResource } from './Resource'
import membersListAsResourceData from './membersListAsResourceData'
import Request from './Request'
import Response from './Response'
import ResourceData from './ResourceData'
import * as Stream from 'stream'
import sha256 from './sha256'
import * as uuid from 'uuid/v4'

function readStream(stream: Stream): Promise<string> {
  return new Promise(resolve => {
    let text = ''
    stream.on('data', chunk => {
      text += chunk
    })
    stream.on('end', () => {
      resolve(text)
    })
  })
}

export default class Router {
  storage: AtomicTree | undefined

  constructor(storage) {
    this.storage = storage
  }

  handle(request: Request) {
    return this[request.method](request.path, request.headers, request.body, request.domain)
  }

  async getResourceData(path:string): Promise<ResourceData> {
    const resource = this.storage.getReadLockedResource(path)
    if (resource.exists()) {
      const resourceData = await resource.getData()
      resource.releaseLock()
      return resourceData
    }
    resource.releaseLock()
    return {
      contentType: 'application/octet-stream',
      body: '',
    } as ResourceData
  }

  calculateETag(resourceData: ResourceData): string {
    return sha256(resourceData.body)
  }

  async getETag(path: string): Promise<string> {
    const resourceData = await this.getResourceData(path)
    return `"${this.calculateETag(resourceData)}"`
  }

  async POST(containerPath: string, headers: any, body: Stream): Promise<Response> {
    const resourcePath = containerPath + uuid()
    const resource = this.storage.getReadWriteLockedResource(resourcePath)
    if (!resource.exists()) {
      await resource.reset()
    }
    const resourceData: ResourceData = {
      contentType: headers['Content-Type'],
      body: await readStream(body)
    }
    resource.setData(resourceData)
    return new Response(201, { Location: resourcePath }, 'Created')
  }

  async PUT(path: string, headers: any, body: Stream): Promise<Response> {
    console.log('checking headers', headers)
    if (headers['if-match']) {
      const etag = await this.getETag(path)
      if (etag !== headers['if-match']) {
        console.log(headers, etag, 'no! 412')
        return new Response(412, {}, '')
      }
    }
    const resource = this.storage.getReadWriteLockedResource(path)
    let status = 200
    if (!resource.exists()) {
      await resource.reset()
      status = 201
    }
    const resourceData: ResourceData = {
      contentType: headers['Content-Type'],
      body: await readStream(body)
    }
    resource.setData(resourceData)
    return new Response(status, { 'Content-Type': 'text/plain' }, 'OK')
  }

  async GET(path: string, headers: any, body: Stream.Readable, domain: string): Promise<Response> {
    let types: Array<string> = [
      '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
    ]
    let resourceData
    if (path.substr(-1) == '/') {
      types.push('<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"')
      const container = this.storage.getReadLockedContainer(path)
      const membersList: Array<string> = await container.getMembers()
      resourceData = membersListAsResourceData(domain + path, membersList, headers)
    } else {
      resourceData = await this.getResourceData(path)
    }
    let etag = sha256(resourceData.body)
    const header = {
      'Content-Type': resourceData.contentType,
      'Link': `<.acl>; rel="acl", <.meta>; rel="describedBy", ${types.join(', ')}`,
      'Allow': 'GET, HEAD, POST, PUT, DELETE, PATCH',
      'Accept-Patch': 'application/sparql-update',
      'Accept-Post': 'application/sparql-update',
      'ETag': `"${etag}"`,
    }
    return new Response(200, headers, body)
  }

  async HEAD(path: string, headers: any, body: Stream.Readable, domain: string): Promise<Response> {
    const response = await this.GET(path, headers, body, domain)
    response.setBody('')
    return response
  }

  async OPTIONS(path: string, headers: any, body: Stream.Readable, domain: string): Promise<Response> {
    return this.HEAD(path, headers, body, domain)
  }

  async DELETE(path: string, headers: any): Promise<Response> {
    if (headers['If-Match'] && this.getETag(path) !== headers['If-Match']) {
      return new Response(412, {}, '')
    }
    let readWriteLockedNode: ReadWriteLockedNode
    if (path.substr(-1) === '/') {
      readWriteLockedNode = this.storage.getReadWriteLockedContainer(path)
    } else {
      readWriteLockedNode = this.storage.getReadWriteLockedResource(path)
    }
    await readWriteLockedNode.delete()
    console.log('deleted', path)
    return new Response(200, { 'Content-Type': 'text/plain' }, 'Deleted')
  }
}

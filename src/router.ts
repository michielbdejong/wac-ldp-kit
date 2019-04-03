import IResourceStore from './IResourceStore'
import IResourceIdentifier from './IResourceIdentifier'
import IRepresentation from './IRepresentation'
import toFolderDescription from './toFolderDescription'
import IResponse from './IResponse'
import * as Stream from 'stream'
import sha256 from './sha256'

function stringToStream ( text: string ) : Stream {
  const stream = new Stream.Readable()
  stream._read = () => {}
  stream.push(text)
  stream.push(null)
  return stream
}

function make412Response () {
  return {
    status: 412,
    headers: {},
    body: stringToStream(''),
  } as IResponse
}

export default class Router {
  resourceStore: IResourceStore | undefined
  constructor(resourceStore) {
    this.resourceStore = resourceStore
  }

  async getETag(identifier) {
    const representation = await this.resourceStore.getRepresentation(identifier)
    const etag = sha256(representation.body)
    return `"${etag}"`
  }

  async POST(container: IResourceIdentifier, headers: any, representation: IRepresentation): Promise<IResponse> {
    const identifier = await this.resourceStore.addResource(container, representation)
    return {
      status: 201,
      headers: {
        Location: identifier.path
      },
      body: stringToStream('Created')
    } as IResponse
  }

  async PUT(identifier: IResourceIdentifier, headers: any, representation: IRepresentation): Promise<IResponse> {
    console.log('checking headers', headers)
    if (headers['if-match']) {
      const etag = await this.getETag(identifier)
      if (etag !== headers['if-match']) {
        console.log(headers, etag, 'no! 412')
        return make412Response()
      }
    }
    await this.resourceStore.setRepresentation(identifier, representation)
    return {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: stringToStream('OK')
    } as IResponse
  }

  async GET(identifier: IResourceIdentifier, headers: any): Promise<IResponse> {
    let types: Array<string> = [
      '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
    ]
    let representation
    if (identifier.path.substr(-1) == '/') {
      types.push('<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"')
      const membersList: Array<string> = await this.resourceStore.getMembers(identifier)
      representation = toFolderDescription(identifier.domain + identifier.path, membersList, headers)
    } else {
      representation = await this.resourceStore.getRepresentation(identifier)
    }
    const etag = sha256(representation.body)
    return {
      status: 200,
      headers: {
        'Content-Type': representation.contentType,
        'Link': `<.acl>; rel="acl", <.meta>; rel="describedBy", ${types.join(', ')}`,
        'Allow': 'GET, HEAD, POST, PUT, DELETE, PATCH',
        'Accept-Patch': 'application/sparql-update',
        'Accept-Post': 'application/sparql-update',
        'ETag': `"${etag}"`,
      },
      body: representation.body,
    } as IResponse
  }

  async HEAD(identifier: IResourceIdentifier, headers): Promise<IResponse> {
    const response = await this.GET(identifier, headers)
    return {
      status: response.status,
      headers: response.headers,
      body: stringToStream('')
    } as IResponse
  }

  async OPTIONS(identifier: IResourceIdentifier, headers: any): Promise<IResponse> {
    return this.HEAD(identifier, headers)
  }

  async DELETE(identifier: IResourceIdentifier, headers: any): Promise<IResponse> {
    if (headers['If-Match'] && this.getETag(identifier) !== headers['If-Match']) {
      return make412Response()
    }
    await this.resourceStore.deleteResource(identifier)
    console.log('deleted', identifier)
    return {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: stringToStream('Deleted')
    } as IResponse
  }
}

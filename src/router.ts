import IResourceStore from './IResourceStore'
import IResourceIdentifier from './IResourceIdentifier'
import IRepresentation from './IRepresentation'
import folderDescription from './folderDescription'
import IResponse from './IResponse'
import * as Stream from 'stream'
import sha256 from './sha256'

function toRepresentation ( text: string ) : IRepresentation {
  const stream = new Stream.Readable()
  stream._read = () => {}
  stream.push(text)
  stream.push(null)
  return stream as IRepresentation
}

export default class Router {
  resourceStore: IResourceStore | undefined
  constructor(resourceStore) {
    this.resourceStore = resourceStore
  }

  async POST(container: IResourceIdentifier, representation: IRepresentation): Promise<IResponse> {
    const identifier = await this.resourceStore.addResource(container, representation)
    return {
      status: 201,
      headers: {
        Location: identifier.path
      },
      body: toRepresentation('Created')
    } as IResponse
  }

  async PUT(identifier: IResourceIdentifier, representation: IRepresentation): Promise<IResponse> {
    await this.resourceStore.setRepresentation(identifier, representation)
    return {
      status: 200,
      headers: {
      },
      body: toRepresentation('OK')
    } as IResponse
  }

  async GET(identifier: IResourceIdentifier): Promise<IResponse> {
    let body: Stream
    if (identifier.path.substr(-1) == '/') {
      const membersList: Array<string> = await this.resourceStore.getMembers(identifier)
      body = toRepresentation(folderDescription(membersList))
    } else {
      body = await this.resourceStore.getRepresentation(identifier)
    }
    const etag = sha256(body)
    return {
      status: 200,
      headers: {
        'Content-Type': 'text/turtle',
        'Link': '<.acl>; rel="acl", <.meta>; rel="describedBy", <http://www.w3.org/ns/ldp#BasicContainer>; rel="type"',
        'ETag': `"${etag}"`,
      },
      body,
    } as IResponse
  }

  async HEAD(identifier: IResourceIdentifier): Promise<IResponse> {
    const representation = await this.resourceStore.getRepresentation(identifier)
    return {
      status: 200,
      headers: {
      },
      body: representation
    } as IResponse
  }

  async OPTIONS(identifier: IResourceIdentifier): Promise<IResponse> {
    const representation = await this.resourceStore.getRepresentation(identifier)
    return {
      status: 200,
      headers: {
        Allow: 'GET, POST, PUT, DELETE, PATCH'
      },
      body: representation
    } as IResponse
  }
}

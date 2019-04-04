import IResourceStore from './IResourceStore'
import IResourceIdentifier from './IResourceIdentifier'
import IRepresentation from './IRepresentation'
import IResponse from './IResponse'

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
      body: 'Created'
    } as IResponse
  }

  async GET(identifier: IResourceIdentifier): Promise<IResponse> {
    const representation = await this.resourceStore.getRepresentation(identifier)
    return {
      status: 200,
      headers: {
        'Content-Type': 'text/turtle',
        'Link': '<.acl>; rel="acl", <.meta>; rel="describedBy", <http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
      },
      body: representation
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
      },
      body: representation
    } as IResponse
  }
}

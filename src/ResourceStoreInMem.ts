import IResourceStore from './IResourceStore'
import IPatch from './IPatch'
import IRepresentation from './IRepresentation'
import IResourceIdentifier from './IResourceIdentifier'

export default class ResourceStoreInMem implements IResourceStore {
  kv: any

  constructor () {
    this.kv = {}
    console.log('constructed in-mem store', this.kv)
  }

  /**
   * Obtains a representation of the given resource.
   *
   * @param identifier - The identifier of the resource
   *
   * @returns - A representation of the resource
   */
  getRepresentation(identifier: IResourceIdentifier): Promise<IRepresentation> {
    return this.kv[identifier.path]
  }

  /**
   * Adds a resource to the container.
   *
   * @param container - The identifier of the container
   * @param representation - A representation of the resource
   *
   * @returns - The identifier of the appended resource
   */
  async addResource(container: IResourceIdentifier,
              representation: IRepresentation): Promise<IResourceIdentifier> {
    const path = container.path + '/1'
    let body = ''
    representation.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    })
    await new Promise (resolve => {
      representation.on('end', () => {
        resolve()
      })
    })
    console.log('saving!', { body, path })
    this.kv[path] = body
    return { ...container, path }
  };

  /**
   * Sets or replaces the representation of a resource.
   *
   * @param identifier - The identifier of the resource
   * @param representation - A representation of the resource
   */
  async setRepresentation(identifier: IResourceIdentifier,
                    representation: IRepresentation): Promise<void> {
    this.kv[identifier.path] = representation
  };

  /**
   * Deletes the given resource.
   *
   * @param identifier - The identifier of the resource
   * @param representation - A representation of the resource
   */
  async deleteResource(identifier: IResourceIdentifier): Promise<void> {
    delete this.kv[identifier.path]
  };

  /**
   * Modifies the given resource.
   *
   * @param identifier - The identifier of the resource
   * @param patch - The patch to be applied to the resource
   */
  async modifyResource(identifier: IResourceIdentifier, patch: IPatch): Promise<void> {
    // TODO: implement
  };
}

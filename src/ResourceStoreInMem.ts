import IResourceStore from './IResourceStore';
import Patch from './Patch';
import Representation from './Representation';
import ResourceIdentifier from './ResourceIdentifier';

export default class ResourceStoreInMem implements IResourceStore {
  kv: {}

  /**
   * Obtains a representation of the given resource.
   *
   * @param identifier - The identifier of the resource
   *
   * @returns - A representation of the resource
   */
  getRepresentation(identifier: ResourceIdentifier): Promise<Representation> {
    return this.kv[identifier.path];
  }

  /**
   * Adds a resource to the container.
   *
   * @param container - The identifier of the container
   * @param representation - A representation of the resource
   *
   * @returns - The identifier of the appended resource
   */
  async addResource(container: ResourceIdentifier,
              representation: Representation): Promise<ResourceIdentifier> {
    const path = container.path + '/1'
    this.kv[path] = representation
    return { ...container, path }
  };

  /**
   * Sets or replaces the representation of a resource.
   *
   * @param identifier - The identifier of the resource
   * @param representation - A representation of the resource
   */
  async setRepresentation(identifier: ResourceIdentifier,
                    representation: Representation): Promise<void> {
    this.kv[identifier.path] = representation
  };

  /**
   * Deletes the given resource.
   *
   * @param identifier - The identifier of the resource
   * @param representation - A representation of the resource
   */
  async deleteResource(identifier: ResourceIdentifier): Promise<void> {
    delete this.kv[identifier.path]
  };

  /**
   * Modifies the given resource.
   *
   * @param identifier - The identifier of the resource
   * @param patch - The patch to be applied to the resource
   */
  async modifyResource(identifier: ResourceIdentifier, patch: Patch): Promise<void> {
    // TODO: implement
  };
}

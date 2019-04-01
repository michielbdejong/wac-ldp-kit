import IPatch from './IPatch'
import IRepresentation from './IRepresentation'
import IResourceIdentifier from './IResourceIdentifier'

// Based on Ruben Verborgh's https://github.com/RubenVerborgh/solid-server-ts/blob/master/src/ldp

export default interface IResourceStore {
  /**
  * Obtains a list of members of the given container.
  *
  * @param container - The identifier of the resource container
  *
  * @returns - A list of member resources
  */
  getMembers(container: IResourceIdentifier): Promise<Array<string>>

  /**
   * Obtains a representation of the given resource.
   *
   * @param identifier - The identifier of the resource
   *
   * @returns - A representation of the resource
   */
  getRepresentation(identifier: IResourceIdentifier): Promise<IRepresentation>

  /**
   * Adds a resource to the container.
   *
   * @param container - The identifier of the container
   * @param representation - A representation of the resource
   *
   * @returns - The identifier of the appended resource
   */
  addResource(container: IResourceIdentifier,
              representation: IRepresentation): Promise<IResourceIdentifier>

  /**
   * Sets or replaces the representation of a resource.
   *
   * @param identifier - The identifier of the resource
   * @param representation - A representation of the resource
   */
  setRepresentation(identifier: IResourceIdentifier,
                    representation: IRepresentation): Promise<void>

  /**
   * Deletes the given resource.
   *
   * @param identifier - The identifier of the resource
   * @param representation - A representation of the resource
   */
  deleteResource(identifier: IResourceIdentifier): Promise<void>

  /**
   * Modifies the given resource.
   *
   * @param identifier - The identifier of the resource
   * @param patch - The patch to be applied to the resource
   */
  modifyResource(identifier: IResourceIdentifier, patch: IPatch): Promise<void>
}

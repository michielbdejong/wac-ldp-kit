import IResourceStore from './IResourceStore'
import IPatch from './IPatch'
import IRepresentation from './IRepresentation'
import IResourceIdentifier from './IResourceIdentifier'
import * as uuid from 'uuid/v4'
import * as Stream from 'stream'

function toRepresentation ( text: string ) : IRepresentation {
  const stream = new Stream.Readable()
  stream._read = () => {}
  stream.push(text)
  stream.push(null)
  return stream as IRepresentation
}

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
    let body
    if (identifier.path.substr(-1) == '/') {
       body = Object.keys(this.kv).filter(x => {
         return (x.substr(0, identifier.path.length) == identifier.path)
       }).join('\r\n')
    } else {
      body = this.kv[identifier.path]
    }
    return Promise.resolve(toRepresentation(body))
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
    const path = container.path + uuid()
    await this.setRepresentation({ ...container, path }, representation)

    return { ...container, path }
  }

  /**
   * Sets or replaces the representation of a resource.
   *
   * @param identifier - The identifier of the resource
   * @param representation - A representation of the resource
   */
  async setRepresentation(identifier: IResourceIdentifier,
                    representation: IRepresentation): Promise<void> {
    let body = ''
    representation.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    })
    await new Promise (resolve => {
      representation.on('end', () => {
        resolve()
      })
    })
    console.log('saving!', { body, identifier })
    this.kv[identifier.path] = body
  }

  /**
   * Deletes the given resource.
   *
   * @param identifier - The identifier of the resource
   */
  async deleteResource(identifier: IResourceIdentifier): Promise<void> {
    delete this.kv[identifier.path]
  }

  /**
   * Modifies the given resource.
   *
   * @param identifier - The identifier of the resource
   * @param patch - The patch to be applied to the resource
   */
  async modifyResource(identifier: IResourceIdentifier, patch: IPatch): Promise<void> {
    // TODO: implement
  }
}

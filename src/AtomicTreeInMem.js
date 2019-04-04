import AtomicTree from './AtomicTree'

class ReadLockedNodeInMem implements ReadLockedNode {
  constructor(path: string, tree: AtomicTreeInMem) {
    this.path = path
    this.tree = tree
  }
  release() {
  }
  exists() {
    return (Object.keys(this.tree.kv).indexOf(this.path) !== -1)
  }
}

class ReadLockedContainerInMem extends ReadLockedNodeInMem implements ReadLockedContainer {
  getDescendents() {
    return Object.keys(this.tree.kv).filter(x => {
      return (x.substr(0, this.path.length) == this.path)
    })
  }
  getMembers() {
    const list = getDescendents()
    // TODO: only report directly contained members
    // but don't forget
    console.log('getMembers', this.path, this.tree.kv, list)
    return Promise.resolve(list)
  }
}

class ReadWriteLockedContainerInMem extends ReadLockedContainerInMem implements ReadWriteLockedContainer {
  delete() {
    this.getDescendents().map(x => {
      delete this.tree.kv[x]
    }
    return Promise.resolve()
  }
  reset() {
    this.tree.kv[this.path + '.placeholder'] = undefined // basically same trick git uses for empty folders
    return Promise.resolve()
  }
}

class ReadLockedResourceInMem extends ReadLockedNodeInMem implements ReadLockedResource {
  getData() {
    return Promise.resolve(this.tree[this.path])
  }
}

class ReadWriteLockedResourceInMem extends ReadLockedResourceInMem implements ReadWriteLockedResource {
  setData(data) {
    this.tree[this.path] = data
    return Promise.resolve()
  }
  delete() {
    delete this.tree[this.path]
    return Promise.resolve()
  }
  reset() {
    this.tree.kv[this.path] = undefined
    return Promise.resolve()
  }
}

export default class AtomicTreeInMem {
  kv: any

  constructor () {
    this.kv = {}
    console.log('constructed in-mem store', this.kv)
  }

  getReadLockedContainer(path: string) {
    return new ReadLockedContainerInMem(path, this)
  }
  getReadWriteLockedContainer(path: string) {
    return new ReadWriteLockedContainerInMem(path, this)
  }
  getReadLockedResource(path: string) {
    return new ReadLockedResourceInMem(path, this)
  }
  getReadWriteLockedResource(path: string) {
    return new ReadWriteLockedResourceInMem(path, this)
  }
  on(eventName: string, eventHandler: (event: any) => void) {
    //TODO: implement
    console.log('adding event handler', eventName, eventHandler)
  }
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
    representation.body.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    })
    await new Promise (resolve => {
      representation.body.on('end', () => {
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

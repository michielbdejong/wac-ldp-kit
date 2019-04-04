import { ReadLockedNode, ReadWriteLockedNode } from './Node'
import { ReadLockedContainer, ReadWriteLockedContainer } from './Container'
import { ReadLockedResource, ReadWriteLockedResource } from './Resource'
import AtomicTree from './AtomicTree'

class ReadLockedNodeInMem implements ReadLockedNode {
  path: string
  tree: AtomicTreeInMem

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
    const list = this.getDescendents()
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
    })
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

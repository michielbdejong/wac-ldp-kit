import Debug from 'debug'
import { Node } from './Node'
import { Container } from './Container'
import { Blob } from './Blob'
import AtomicTree from './AtomicTree'

const debug = Debug('AtomicTreeInMem')

class NodeInMem {
  path: string
  tree: AtomicTreeInMem

  constructor (path: string, tree: AtomicTreeInMem) {
    this.path = path
    this.tree = tree
    debug('constructed node', path, tree)
  }
  exists () {
    debug('checking exists', this.path, Object.keys(this.tree.kv))
    return (Object.keys(this.tree.kv).indexOf(this.path) !== -1)
  }
}

class ContainerInMem extends NodeInMem implements Container {
  getDescendents () {
    return Object.keys(this.tree.kv).filter(x => {
      return (x.substr(0, this.path.length) === this.path)
    })
  }
  getMembers () {
    const list = this.getDescendents()
    // TODO: only report directly contained members
    // but don't forget
    debug('getMembers', this.path, this.tree.kv, list)
    return Promise.resolve(list)
  }
  delete () {
    this.getDescendents().map(x => {
      delete this.tree.kv[x]
    })
    return Promise.resolve()
  }
  reset () {
    this.tree.kv[this.path + '.placeholder'] = undefined // basically same trick git uses for empty folders
    return Promise.resolve()
  }
}

class BlobInMem extends NodeInMem implements Blob {
  getData () {
    debug('reading resource', this.path, this.tree.kv)
    return Promise.resolve(this.tree.kv[this.path])
  }
  setData (data) {
    this.tree.kv[this.path] = data
    debug('this.tree.kv after setData', this.tree.kv)
    return Promise.resolve()
  }
  delete () {
    delete this.tree.kv[this.path]
    return Promise.resolve()
  }
  reset () {
    this.tree.kv[this.path] = undefined
    return Promise.resolve()
  }
}

export default class AtomicTreeInMem {
  kv: any

  constructor () {
    this.kv = {}
    debug('constructed in-mem store', this.kv)
  }

  getContainer (path: string) {
    return new ContainerInMem(path, this)
  }
  getBlob (path: string) {
    return new BlobInMem(path, this)
  }
  on (eventName: string, eventHandler: (event: any) => void) {
    // TODO: implement
    debug('adding event handler', eventName, eventHandler)
  }
}

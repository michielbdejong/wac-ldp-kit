import Debug from 'debug'
import { Node } from './Node'
import { Container } from './Container'
import { Blob } from './Blob'
import { AtomicTree, Path } from './AtomicTree'

const debug = Debug('AtomicTreeInMem')

class NodeInMem {
  path: Path
  tree: AtomicTreeInMem

  constructor (path: Path, tree: AtomicTreeInMem) {
    this.path = path
    this.tree = tree
    debug('constructed node', path, tree)
  }
  exists () {
    debug('checking exists', this.path.toString(), Object.keys(this.tree.kv))
    return (Object.keys(this.tree.kv).indexOf(this.path.toString()) !== -1)
  }
}

const PLACEHOLDER_MEMBER_NAME = '.placeholder'

class ContainerInMem extends NodeInMem implements Container {
  getDescendents () {
    return Object.keys(this.tree.kv).filter(x => {
      return (x.length > this.path.toString().length)
    }).filter(x => {
      return (x.substr(0, this.path.toString().length) === this.path.toString())
    })
  }
  getMembers () {
    const list = this.getDescendents().filter(x => (x !== PLACEHOLDER_MEMBER_NAME))
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
    this.tree.kv[this.path.toString() + PLACEHOLDER_MEMBER_NAME] = undefined // basically same trick some git users use for empty folders
    return Promise.resolve()
  }
}

class BlobInMem extends NodeInMem implements Blob {
  getData () {
    debug('reading resource', this.path, this.tree.kv)
    return Promise.resolve(this.tree.kv[this.path.toString()])
  }
  setData (data) {
    this.tree.kv[this.path.toString()] = data
    debug('this.tree.kv after setData', this.tree.kv)
    return Promise.resolve()
  }
  delete () {
    delete this.tree.kv[this.path.toString()]
    return Promise.resolve()
  }
  reset () {
    this.tree.kv[this.path.toString()] = undefined
    return Promise.resolve()
  }
}

export default class AtomicTreeInMem {
  kv: any

  constructor () {
    this.kv = {}
    debug('constructed in-mem store', this.kv)
  }

  getContainer (path: Path) {
    return new ContainerInMem(path, this)
  }
  getBlob (path: Path) {
    return new BlobInMem(path, this)
  }
  on (eventName: string, eventHandler: (event: any) => void) {
    // TODO: implement
    debug('adding event handler', eventName, eventHandler)
  }
}

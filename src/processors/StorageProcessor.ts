import { AtomicTree } from '../AtomicTree'

export default class StorageProcessor {
  storage: AtomicTree

  constructor (storage: AtomicTree) {
    this.storage = storage
  }
}

import AtomicTree from '../AtomicTree'

export default class StorageWorker {
  storage: AtomicTree

  constructor (storage: AtomicTree) {
    this.storage = storage
  }
}

import AtomicTreeInMem from './AtomicTreeInMem'

// singleton in-memory AtomicTree instance for the whole process:
console.log('creating storage singleton')
const storage = new AtomicTreeInMem()
export default storage

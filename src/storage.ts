import AtomicTreeInMem from './AtomicTreeInMem'

// singleton in-memory AtomicTree instance for the whole process:
const storage = new AtomicTreeInMem()
export default storage

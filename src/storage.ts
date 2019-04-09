import * as Debug from 'debug'
import AtomicTreeInMem from './AtomicTreeInMem'

const debug = Debug('storage')


// singleton in-memory AtomicTree instance for the whole process:
debug('creating storage singleton')
const storage = new AtomicTreeInMem()
export default storage

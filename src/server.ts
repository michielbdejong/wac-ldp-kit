import * as http from 'http'
import Debug from 'debug'
import AtomicTreeInMem from './AtomicTreeInMem'
import makeHandler from './app'

const debug = Debug('server')
const port = 8080

const storage = new AtomicTreeInMem() // singleton in-memory storage
const handler = makeHandler(storage)
const server = http.createServer(handler)

// ...
server.listen(port)
debug('listening on port', port)

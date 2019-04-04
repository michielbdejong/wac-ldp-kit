import * as http from 'http'
import ResourceStoreInMem from './ResourceStoreInMem'
import IResourceIdentifier from './IResourceIdentifier'
import IRepresentation from './IRepresentation'
import IResponse from './IResponse'
import Router from './router'

const port = 8000

const resourceStore = new ResourceStoreInMem()
const router = new Router(resourceStore)

const server = http.createServer(async (req: any, res: any) => {
  console.log(req.method, req.headers, req.url)
  const identifier = { path: req.url } as IResourceIdentifier
  const representation = req as IRepresentation
  const response = await router[req.method](identifier, representation)
  res.writeHead(response.status, response.headers)
  res.end(response.body)
})

// ...
server.listen(port)
console.log('listening on port', port)

import * as http from 'http'
import ResourceStoreInMem from './ResourceStoreInMem'
import IResourceIdentifier from './IResourceIdentifier'
import IRepresentation from './IRepresentation'
import IResponse from './IResponse'
import Router from './router'

const port = 8080

const resourceStore = new ResourceStoreInMem()
const router = new Router(resourceStore)

const server = http.createServer(async (req: any, res: any) => {
  console.log(req.method, req.headers, req.url)
  const identifier = { domain: `http://localhost:${port}`, path: req.url } as IResourceIdentifier
  const representation = {
    body: req,
    contentType: 'text/turtle'
  } as IRepresentation
  const response = await router[req.method](identifier, req.headers, representation)
  res.writeHead(response.status, response.headers)
  response.body.pipe(res)
})

// ...
server.listen(port)
console.log('listening on port', port)

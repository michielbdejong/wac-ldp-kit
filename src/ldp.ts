import * as http from 'http'
import Request from './Request'
import Response from './Response'
import Router from './router'
import AtomicTreeInMem from './AtomicTreeInMem'

const port = 8080

const storage = new AtomicTreeInMem()
const router = new Router(storage)

const server = http.createServer(async (req: any, res: any) => {
  console.log(req.method, req.headers, req.url)
  const request = {
    domain: `http://localhost:${port}`,
    path: req.url,
    method: req.method,
    headers: req.headers,
    body: req
  } as Request
  const response = await router.handle(request)
  res.writeHead(response.status, response.headers)
  response.body.pipe(res)
})

// ...
server.listen(port)
console.log('listening on port', port)

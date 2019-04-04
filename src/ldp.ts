import * as http from 'http'
import ResourceStoreInMem from './ResourceStoreInMem'
const resoureStore = new ResourceStoreInMem()

const server = http.createServer((req: any, res: any) => {
  console.log(req.method, req.headers, req.url)
  if (req.method === 'POST') {
    res.writeHead(201, {
      Location: '/1'
    })
    res.end('Yep')
  } else {
    res.writeHead(200, {})
    res.end('Yep')
  }
})
server.listen(8000)

import * as Stream from 'stream'

export default class Request {
  // constructor(domain: string, path: string, headers: any, body: stream) {
  //   this.domain = domain
  //   this.path = path
  //   this.headers = headers
  //   this.body = body
  // },
  domain: string
  path: string
  method: string
  headers: any
  body: Stream.Readable
}

// import * as Stream from 'stream'
//
// export default class Response {
//   status: number
//   headers: any
//   body: Stream.Readable
//   releaseCallback: any
//
//   constructor(status: number, headers: any, body: string | Stream.Readable) {
//     this.status = status
//     this.headers = headers
//     if (typeof body === 'string') {
//       this.setBody(body as string)
//     } else {
//       this.body = body as Stream.Readable
//     }
//   }
//
//   setBody(body: string): void {
//     this.body = new Stream.Readable()
//     this.body._read = () => {}
//     this.body.push(body)
//     this.body.push(null)
//   }
//
//   release() {
//     if (this.releaseCallback) {
//       this.releaseCallback()
//     }
//   }
// }

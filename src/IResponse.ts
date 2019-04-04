import * as Stream from 'stream'

export default interface IResponse {
  body: Stream | string,
  status: number,
  headers: any
}

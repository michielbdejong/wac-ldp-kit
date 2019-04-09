// import * as Stream from 'stream'
import calculateETag from './calculateETag'

export interface ResourceData {
  body: string
  contentType: string
  etag: string
}
export function makeResourceData (contentType, body) {
  return {
    contentType,
    body,
    etag: calculateETag(body)
  } as ResourceData
}

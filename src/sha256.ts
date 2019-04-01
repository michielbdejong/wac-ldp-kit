import * as crypto from 'crypto'
import * as Stream from 'stream'

const secret = 'abcdefg'

export default function sha256 (s: Stream) {
  const hmac = crypto.createHmac('sha256', secret)
  s.pipe(hmac)
  return hmac.digest('hex')
}

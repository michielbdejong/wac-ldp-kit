import * as crypto from 'crypto'

const secret = 'abcdefg'

export default function sha256 (text: string) {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(text)
  return hmac.digest('hex')
}

import { Container } from './Container'
import { Blob } from './Blob'

export default interface AtomicTree {
  getContainer (path: string): Container
  getBlob (path: string): Blob
  on (eventName: string, eventHandler: (event: any) => void): void
}

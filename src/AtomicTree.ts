import { Container } from './Container'
import { Blob } from './Blob'

export class Path {
  parts: Array<string>
  constructor (str: string) {
    this.parts = str.split('/')
  }
  asString (): string {
    return this.parts.join('/')
  }
}

export interface AtomicTree {
  getContainer (path: Path): Container
  getBlob (path: Path): Blob
  on (eventName: string, eventHandler: (event: any) => void): void
}

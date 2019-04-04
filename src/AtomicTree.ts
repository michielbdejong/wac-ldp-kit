import { ReadLockedContainer, ReadWriteLockedContainer } from './Container'
import { ReadLockedResource, ReadWriteLockedResource } from './Resource'

// Inspired on Ruben Verborgh's ResourceStore abstraction, see:
// https://github.com/RubenVerborgh/solid-server-ts/issues/6

export default interface AtomicTree {
  getReadLockedContainer(path: string): ReadLockedContainer
  getReadWriteLockedContainer(path: string): ReadWriteLockedContainer
  getReadLockedResource(path: string): ReadLockedResource
  getReadWriteLockedResource(path: string): ReadWriteLockedResource
  on(eventName: string, eventHandler: (event: any) => void): void
}

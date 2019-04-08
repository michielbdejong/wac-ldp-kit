import { ReadLockedNode, ReadWriteLockedNode } from './Node'

export interface ReadLockedResource extends ReadLockedNode {
  getData(): Promise<any>
}

export interface ReadWriteLockedResource extends ReadLockedResource, ReadWriteLockedNode {
  setData(data: any): Promise<void>
}

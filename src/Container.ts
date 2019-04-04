import { ReadLockedNode, ReadWriteLockedNode } from './Node'

export interface ReadLockedContainer extends ReadLockedNode{
  getMembers(): Promise<Array<string>>
}

export interface ReadWriteLockedContainer extends ReadLockedContainer, ReadWriteLockedNode {
}

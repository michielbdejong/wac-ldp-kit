export interface ReadLockedNode {
  releaseLock(): void,
  exists(): boolean,
}

export interface ReadWriteLockedNode extends ReadLockedNode {
  delete(): Promise<void>,
  reset(): Promise<void>,
}

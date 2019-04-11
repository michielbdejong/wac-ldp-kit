export interface Node {
  exists (): boolean,
  delete (): Promise<void>,
  reset (): Promise<void>,
}

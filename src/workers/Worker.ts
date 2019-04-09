export default interface Worker {
  handle (task: any): Promise<any>
}

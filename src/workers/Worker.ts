import Task from '../Task'

export default class Worker {
  colleagues: any // how do I tell TypeScript that this should be an Object containing Workers?
  constructor(colleagues: any) {
    console.log('worker instantiated')
    this.colleagues = colleagues
  }

  // overwrite this to do perform the posted task and post other tasks to
  // colleagues as necessary.
  // Tasks are passed around, and workers don't keep state.
  // For instance, a task to handle a http request has to include the `res`
  // argument from the original HttpRequest wherever it goes, so that the
  // http responder worker has all the necessary state to do its job when the
  // task reaches that last worker.
  // That's also why the Worker#post method doesn't return a result
  post(task: any): void {
    console.log('Received task but no Worker implementation!', task)
  }
}

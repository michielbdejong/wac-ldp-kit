import Worker from './Worker'
export default class ResponderAndReleaser extends Worker {
  post(task: any) {
    task.httpRes.writeHead(task.responseStatus, task.responseHeaders)
    task.responseBody.pipe(task.httpRes)
    task.httpRes.on('end', () => {
      if (task.lock) {
        task.lock.release()
      }
    })
  }
}

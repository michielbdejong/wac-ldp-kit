import Worker from './Worker'
import { ResponderAndReleaserTask, ResultType } from './ResponderAndReleaser'
import LdpTask from '../Task'

// Used as:
//  * workers.splitToTask
// Receives tasks from:
//  * the AclChecker at determineAllowedModes
// Posts tasks to:
//  * the ContainerReader at containerRead
//  * the GlobReader at workers.globRead
//  * the ResourceReader at workers.resourceRead
//  * the ContainerDeleter at workers.containerDelete
//  * the ResourceDeleter at workers.resourceDelete
//  * the ResponderAndReleaser at workers.respondAndRelease
//  * the ContainerMemberAdder at workers.containerMemberAdd
//  * the ResourceWriter at workers.resourceWrite
//  * the ResourceUpdater at workers.resourceUpdate

export class LdpTaskSplitter extends Worker {
  post(task: LdpTask) {
    this.colleagues[task.ldpTaskName].post(task as LdpTask)
  }
}

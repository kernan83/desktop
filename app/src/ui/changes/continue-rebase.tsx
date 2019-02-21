import * as React from 'react'
import { Button } from '../lib/button'
import { Loading } from '../lib/loading'
import { RebaseConflictState } from '../../lib/app-state'
import { Dispatcher } from '../dispatcher'
import { Repository } from '../../models/repository'
import { WorkingDirectoryStatus } from '../../models/status'
import { getConflictedFiles } from '../../lib/status'

interface IContinueRebaseProps {
  readonly dispatcher: Dispatcher
  readonly repository: Repository
  readonly workingDirectory: WorkingDirectoryStatus
  readonly rebaseConflictState: RebaseConflictState
  readonly isCommitting: boolean
}

export class ContinueRebase extends React.Component<IContinueRebaseProps, {}> {
  private onSubmit = () => {
    this.continueRebase()
  }

  private async continueRebase() {
    this.props.dispatcher.continueRebase(
      this.props.repository,
      this.props.workingDirectory
    )
  }

  public render() {
    const { targetBranch, manualResolutions } = this.props.rebaseConflictState

    let canCommit = true

    let tooltip = 'Continue rebase'

    if (this.props.rebaseConflictState) {
      const conflictedFilesCount = getConflictedFiles(
        this.props.workingDirectory,
        manualResolutions
      ).length

      if (conflictedFilesCount > 0) {
        tooltip = 'Resolve all conflicts before continuing'
        canCommit = false
      }
    }

    const buttonEnabled = canCommit && !this.props.isCommitting

    const loading = this.props.isCommitting ? <Loading /> : undefined

    // TODO: change this ID and restyle things betterer

    return (
      <div id="commit-message" role="group">
        <Button
          type="submit"
          className="commit-button"
          onClick={this.onSubmit}
          disabled={!buttonEnabled}
          tooltip={tooltip}
        >
          {loading}
          <span>
            {loading ? 'Rebasing' : 'Rebase'} <strong>{targetBranch}</strong>
          </span>
        </Button>
      </div>
    )
  }
}
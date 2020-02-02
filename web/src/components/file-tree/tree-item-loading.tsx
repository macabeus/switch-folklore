import React, { FunctionComponent } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import TreeItem from '@material-ui/lab/TreeItem'

interface Props {
  path: string
}

const TreeItemFolder: FunctionComponent<Props> = ({ path }) => (
  <TreeItem
    nodeId={`${path}-loading`}
    label={
      <CircularProgress size={12} />
    }
  />
)

export default TreeItemFolder

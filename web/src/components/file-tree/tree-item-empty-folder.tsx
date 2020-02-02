import React, { FunctionComponent } from 'react'
import Box from '@material-ui/core/Box'
import TreeItem from '@material-ui/lab/TreeItem'

interface Props {
  path: string
}

const TreeItemEmptyFolder: FunctionComponent<Props> = ({ path }) => (
  <TreeItem
    nodeId={`${path}-empty`}
    label={
      <Box fontStyle='italic'>Empty folder</Box>
    }
  />
)

export default TreeItemEmptyFolder

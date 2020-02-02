import React, { FunctionComponent } from 'react'
import Box from '@material-ui/core/Box'
import TreeItem from '@material-ui/lab/TreeItem'

interface Props {
  path: string
  onClickFile: (path: string) => void
}

const TreeItemEmptyFolder: FunctionComponent<Props> = ({ path, onClickFile }) => (
  <TreeItem
    nodeId={`${path}-empty`}
    onClick={() => onClickFile(path)}
    label={
      <Box fontStyle='italic'>Empty folder</Box>
    }
  />
)

export default TreeItemEmptyFolder

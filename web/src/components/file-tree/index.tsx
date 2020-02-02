import React, { FunctionComponent } from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeView from '@material-ui/lab/TreeView'
import TreeItemFolder from './tree-item-folder'

interface Props {
  initialDirectory: string
  onClickFile: (path: string) => void
}

const FileTree: FunctionComponent<Props> = ({ initialDirectory, onClickFile }) => (
  <TreeView
    defaultCollapseIcon={<ExpandMoreIcon />}
    defaultExpandIcon={<ChevronRightIcon />}
  >
    <TreeItemFolder
      path={initialDirectory}
      folderName={initialDirectory}
      onClickFile={onClickFile}
    />
  </TreeView>
)

export default FileTree

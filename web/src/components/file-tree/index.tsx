import React, { FunctionComponent } from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeView from '@material-ui/lab/TreeView'
import { TContent } from '../../types'
import TreeItemFolder from './tree-item-folder'

type TOnClickFile = (path: string, content?: TContent) => void

interface Props {
  initialDirectory: string
  onClickFile: TOnClickFile
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

export { TOnClickFile }
export default FileTree

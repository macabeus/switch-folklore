import React, { FunctionComponent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TreeItem from '@material-ui/lab/TreeItem'
import { TContent } from '../../types'
import { TOnClickFile } from './'

const useStyles = makeStyles({
  root: {
    paddingLeft: '10px',
  },
})

interface Props {
  path: string
  name: string
  content: TContent
  onClickFile: TOnClickFile
}

const TreeItemFile: FunctionComponent<Props> = ({ path, name, content, onClickFile }) => {
  const classes = useStyles()

  return (
    <TreeItem
      nodeId={name}
      label={name}
      className={classes.root}
      onClick={() => onClickFile(path, content)}
    />
  )
}

export default TreeItemFile

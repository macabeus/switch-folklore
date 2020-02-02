import React, { FunctionComponent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TreeItem from '@material-ui/lab/TreeItem'

const useStyles = makeStyles({
  root: {
    paddingLeft: '10px',
  },
})

interface Props {
  path: string
  name: string
  onClickFile: (path: string) => void
}

const TreeItemFile: FunctionComponent<Props> = ({ path, name, onClickFile }) => {
  const classes = useStyles()

  return (
    <TreeItem
      nodeId={name}
      label={name}
      className={classes.root}
      onClick={() => onClickFile(path)}
    />
  )
}

export default TreeItemFile

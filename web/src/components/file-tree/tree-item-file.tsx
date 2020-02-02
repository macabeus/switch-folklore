import React, { FunctionComponent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TreeItem from '@material-ui/lab/TreeItem'

const useStyles = makeStyles({
  root: {
    paddingLeft: '10px',
  },
})

interface Props {
  name: string
}

const TreeItemFile: FunctionComponent<Props> = ({ name }) => {
  const classes = useStyles()

  return (
    <TreeItem nodeId={name} label={name} className={classes.root} />
  )
}

export default TreeItemFile

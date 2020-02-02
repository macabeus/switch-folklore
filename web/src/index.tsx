import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ReactDOM from 'react-dom'
import FileManager from './cards/file-manager'
import UpdateSwitchFolklore from './cards/update-switch-folklore'

const useStyles = makeStyles(theme => ({
  root: {
    '& > div:not(:last-child)': {
      marginBottom: theme.spacing(3),
    },
  },
}))

const App = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <FileManager />
      <UpdateSwitchFolklore />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))

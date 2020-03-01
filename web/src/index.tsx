import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import ReactDOM from 'react-dom'
import CheatEngine from './cards/cheat-engine'
import FileManager from './cards/file-manager'
import UpdateSwitchFolklore from './cards/update-switch-folklore'
import Theme from './theme'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),

    '& > div:not(:last-child)': {
      marginBottom: theme.spacing(3),
    },
  },
}))

const App = () => {
  const classes = useStyles()

  return (
    <Theme>
      <CssBaseline />
      <div className={classes.root}>
        <FileManager />
        <CheatEngine />
        <UpdateSwitchFolklore />
      </div>
    </Theme>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))

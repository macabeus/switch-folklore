import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import React, { FunctionComponent } from 'react'

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#EAEFFF',
    },
    primary: {
      main: '#3450B3',
    },
  },
})

const Theme: FunctionComponent = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    {children}
  </MuiThemeProvider>
)

export default Theme

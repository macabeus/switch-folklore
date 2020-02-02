import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import FileDetails from '../../components/file-details'
import FileTree from '../../components/file-tree'

const useStyles = makeStyles(theme => ({
  divider: {
    borderLeft: `1px solid ${theme.palette.grey[400]}`,
    paddingLeft: theme.spacing(2),
  },
}))

const initialDirectory = 'sdmc:'

const FileManager = () => {
  const classes = useStyles()
  const [selectedFile, setSelectedFile] = useState('sdmc:')

  return (
    <Card>
      <CardHeader title='File Manager' />
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <FileTree
              initialDirectory={initialDirectory}
              onClickFile={setSelectedFile}
            />
          </Grid>

          <Grid item xs={6} className={classes.divider}>
            <FileDetails fullPath={selectedFile} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FileManager

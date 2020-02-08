import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import { TContent } from '../../types'
import FileDetails from '../../components/file-details'
import FileTree, { TOnClickFile } from '../../components/file-tree'

const useStyles = makeStyles(theme => ({
  divider: {
    borderLeft: `1px solid ${theme.palette.grey[400]}`,
    paddingLeft: theme.spacing(2),
  },
}))

const initialDirectory = 'sdmc:'

const FileManager = () => {
  const classes = useStyles()
  const [selectedFile, setSelectedFile] = useState(initialDirectory)
  const [selectedFileContent, setSelectedFileContent] = useState<TContent>(null)

  const handleOnClickFile: TOnClickFile = (path: string, content?: TContent) => {
    setSelectedFile(path)
    setSelectedFileContent(content)
  }

  return (
    <Card>
      <CardHeader title='File Manager' />
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <FileTree
              initialDirectory={initialDirectory}
              onClickFile={handleOnClickFile}
            />
          </Grid>

          <Grid item xs={6} className={classes.divider}>
            <FileDetails fullPath={selectedFile} fileContent={selectedFileContent} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FileManager

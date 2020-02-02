import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import FileTree from '../../components/file-tree'

const initialDirectory = 'sdmc:/'

const FileManager = () => (
  <Card>
    <CardHeader title='File Manager' />
    <CardContent>
      <FileTree initialDirectory={initialDirectory} />
    </CardContent>
  </Card>
)

export default FileManager

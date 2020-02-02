import React, { FunctionComponent } from 'react'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Typography from '@material-ui/core/Typography'

interface Props {
  fullPath: string
}

const Path: FunctionComponent<Props> = ({ fullPath }) => {
  const pathSplited = fullPath.split('/')
  const paths = pathSplited.slice(0, pathSplited.length - 1)
  const [fileName] = pathSplited.slice(-1)

  return (
    <Breadcrumbs aria-label='breadcrumb'>
      {
        paths.map((path, index) => (
          <Typography key={`${path}-${index}`}>
            {path}
          </Typography>
        ))
      }
      <Typography color='textPrimary'>{fileName}</Typography>
    </Breadcrumbs>
  )
}

export default Path

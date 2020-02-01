import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import LinearProgress from '@material-ui/core/LinearProgress'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Dropzone from './dropzone'

const UpdateSwitchFolklore = () => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [percetage, setPercetage] = useState(0)
  const [uploadError, setUploadError] = useState(null)

  return (
    <Card>
      <CardHeader title='Update Switch Folklore version' />
      <CardContent>
        {
          isUpdating
            ? (
              <LinearProgress variant='determinate' value={percetage} />
            )
            : (
              <>
                <Dropzone
                  setPercetage={setPercetage}
                  setIsUpdating={setIsUpdating}
                  setUploadError={setUploadError}
                />
                {uploadError && <Typography color='error'>Error: {uploadError}</Typography>}
              </>
            )
        }
      </CardContent>
    </Card>
  )
}

export default UpdateSwitchFolklore

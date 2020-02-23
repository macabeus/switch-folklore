import React, { FunctionComponent, useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDropzone, DropzoneOptions } from 'react-dropzone'
import { apiFileManagerUpload } from '../../api/file-manager'
import LoadingButton from '../loading-button'

const useStyles = makeStyles(theme => ({
  uploadButton: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}))

interface Props {
  path: string
}

const UploadButton: FunctionComponent<Props> = ({ path }) => {
  const classes = useStyles()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadPercentage, setUploadPercentage] = useState(0)

  const onDrop: DropzoneOptions['onDrop'] = useCallback(async (acceptedFiles) => {
    setIsUploading(true)
    await apiFileManagerUpload(setUploadPercentage, path)(acceptedFiles[0])
    setIsUploading(false)
  }, [path])

  const buttonText = (
    isUploading
      ? `Upload (${uploadPercentage.toFixed(2)}%)`
      : 'Upload'
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <span {...getRootProps()}>
      <input {...getInputProps()} />
      <LoadingButton
        isLoading={isUploading}
        variant='outlined'
        size='small'
        color='primary'
        className={classes.uploadButton}
      >
        {buttonText}
      </LoadingButton>
    </span>
  )
}

export default UploadButton

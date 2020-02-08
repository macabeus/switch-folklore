import React, { FunctionComponent, useCallback } from 'react'
import { useDropzone, DropzoneOptions } from 'react-dropzone'
import {
  TSetPercetage,
  apiSwitchFolkloreUpload,
  apiSwitchFolkloreReplaceVersion,
  apiSwitchFolkloreRestart,
} from '../../api/switch-folklore'

interface Props {
  setPercetage: TSetPercetage
  setIsUpdating: (newState: boolean) => void
  setUploadError: (message: string) => void
}

const Dropzone: FunctionComponent<Props> = ({ setPercetage, setIsUpdating, setUploadError }) => {
  const onDrop: DropzoneOptions['onDrop'] = useCallback(async (acceptedFiles) => {
    setIsUpdating(true)

    try {
      await apiSwitchFolkloreUpload(setPercetage)(acceptedFiles[0])

      const responseReplaceVersion = await apiSwitchFolkloreReplaceVersion()
      if (responseReplaceVersion.status === 'error') {
        throw new Error(responseReplaceVersion.message)
      }

      const responseRestart = await apiSwitchFolkloreRestart()
      if (responseRestart.status === 'error') {
        throw new Error(responseRestart.message)
      }
    } catch (error) {
      setIsUpdating(false)
      setUploadError(error.message)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Click to select the new switch-folklore version here</p> :
          <p>Drag and drop some the new switch-folklore version here, or click to select it</p>
      }
    </div>
  )
}

export default Dropzone

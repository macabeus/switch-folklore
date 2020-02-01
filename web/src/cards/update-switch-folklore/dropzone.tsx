import React, { FunctionComponent, useCallback } from 'react'
import { useDropzone, DropzoneOptions } from 'react-dropzone'
import wait from '../../helpers/wait'

type TSetPercetage = (percentage: number) => void

const handleUploadFile = (setPercentage: TSetPercetage) => (file: File) =>
  new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()

    req.upload.addEventListener("progress", event => {
      if (event.lengthComputable) {
        setPercentage((event.loaded / event.total) * 100)
      }
    })

    req.upload.addEventListener('load', () => {
      resolve(req.response)
    })

    req.upload.addEventListener("error", () => {
      reject(req.response)
    })

    const formData = new FormData()
    formData.append('file', file, file.name)

    req.open('POST', '/switch-folklore/upload')
    req.send(formData)
  })

interface Props {
  setPercetage: TSetPercetage
  setIsUpdating: (newState: boolean) => void
  setUploadError: (message: string) => void
}

const Dropzone: FunctionComponent<Props> = ({ setPercetage, setIsUpdating, setUploadError }) => {
  const onDrop: DropzoneOptions['onDrop'] = useCallback(async (acceptedFiles) => {
    setIsUpdating(true)

    try {
      await handleUploadFile(setPercetage)(acceptedFiles[0])
      await wait(1000)

      const responseReplaceVersion = await fetch('/switch-folklore/replace-version')
      const responseReplaceVersionJson = await responseReplaceVersion.json()

      if (responseReplaceVersionJson.status === 'error') {
        throw new Error(responseReplaceVersionJson.message)
      }

      let responseRestart: Response
      try {
        responseRestart = await fetch('/switch-folklore/restart')
      } catch (error) {
        if (error.message === 'Failed to fetch') {
          // Since we'll have the connection lost because of the restart, the expected is that we'll receive this error
          location.reload()
          return
        }
      }

      const responseRestartJson = await responseRestart.json()
      throw new Error(responseRestartJson.message)
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

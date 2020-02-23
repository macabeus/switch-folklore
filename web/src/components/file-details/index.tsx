import React, { FunctionComponent, useEffect, useState } from 'react'
import { pipe, split, slice, join } from 'ramda'
import { makeStyles } from '@material-ui/core/styles'
import { apiFileManagerGetFileTextContent, apiFileManagerDownload } from '../../api/file-manager'
import { TContent, TIsTextFile, TContentType } from '../../types'
import LoadingButton from '../loading-button'
import Path from './path'
import UploadButton from './upload-button'

const useStyles = makeStyles(theme => ({
  downloadButton: {
    marginTop: theme.spacing(1),
  },

  fileText: {
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
  },
}))

interface Props {
  fullPath: string
  fileContent: TContent
}

const FileDetails: FunctionComponent<Props> = ({ fullPath, fileContent }) => {
  const classes = useStyles()
  const [fileText, setFileText] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => void (async () => {
    if (fileContent === null || fileContent === undefined) {
      return
    }

    if (fileContent.type === TContentType['File'] && fileContent.isTextFile === TIsTextFile['Yes']) {
      const response = await apiFileManagerGetFileTextContent(fullPath)
      if (typeof response !== 'string') {
        alert(`Error when tried to fetch the text content of this file: ${response.message}`)
        return
      }

      setFileText(response)
      return
    }

    setFileText('')
  })(), [fileContent])

  const handleClickFileDownload = async () => {
    setIsDownloading(true)

    await apiFileManagerDownload(fullPath)

    setIsDownloading(false)
  }

  const directoryPath = (
    fileContent.type === TContentType.File
      ? pipe(split('/'), slice(0, -1), join('/'))(fullPath)
      : fullPath
  )

  return (
    <div>
      <Path fullPath={fullPath} />

      <LoadingButton
        isLoading={isDownloading}
        variant='outlined'
        size='small'
        color='primary'
        disabled={fileContent?.type === TContentType.Folder}
        className={classes.downloadButton}
        onClick={handleClickFileDownload}
      >
        Download
      </LoadingButton>

      <UploadButton path={directoryPath} />

      <p className={classes.fileText}>
        {fileText}
      </p>
    </div>
  )
}

export default FileDetails

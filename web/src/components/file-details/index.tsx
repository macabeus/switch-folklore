import React, { FunctionComponent, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TContent, TIsTextFile, TContentType } from '../../types'
import LoadingButton from '../loading-button'
import Path from './path'

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
  fileContent?: TContent
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
      const response = await fetch(
        '/file-manager/get-file-text-content',
        {
          method: 'POST',
          body: JSON.stringify({ path: fullPath }),
        }
      )

      const text = await response.text()
      setFileText(text)
      return
    }

    setFileText('')
  })(), [fileContent])

  const handleClickFileDownload = async () => {
    setIsDownloading(true)

    const response = await fetch(
      '/file-manager/download',
      {
        method: 'POST',
        body: JSON.stringify({ path: fullPath }),
      }
    )

    const blob = await response.blob()

    setIsDownloading(false)

    const pathSplited = fullPath.split('/')
    const [fileName] = pathSplited.slice(-1)  

    const url = URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    const event = document.createEvent('MouseEvents')
    event.initEvent('click', true, true)
    link.dispatchEvent(event)
  }

  return (
    <div>
      <Path fullPath={fullPath} />

      <LoadingButton
        isLoading={isDownloading}
        variant='outlined'
        size='small'
        color='primary'
        className={classes.downloadButton}
        onClick={handleClickFileDownload}
      >
        Download
      </LoadingButton>

      <p className={classes.fileText}>
        {fileText}
      </p>
    </div>
  )
}

export default FileDetails

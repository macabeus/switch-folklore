import React, { FunctionComponent, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TContent, TIsTextFile, TContentType } from '../../types'
import Path from './path'

const useStyles = makeStyles({
  fileText: {
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
  },
})

interface Props {
  fullPath: string
  fileContent?: TContent
}

const FileDetails: FunctionComponent<Props> = ({ fullPath, fileContent }) => {
  const classes = useStyles()
  const [fileText, setFileText] = useState('')

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

  return (
    <div>
      <Path fullPath={fullPath} />
      <p className={classes.fileText}>
        {fileText}
      </p>
    </div>
  )
}

export default FileDetails

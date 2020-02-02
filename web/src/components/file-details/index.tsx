import React, { FunctionComponent } from 'react'
import Path from './path'

interface Props {
  fullPath: string
}

const FileDetails: FunctionComponent<Props> = ({ fullPath }) => (
  <div>
    <Path fullPath={fullPath} />
  </div>
)

export default FileDetails

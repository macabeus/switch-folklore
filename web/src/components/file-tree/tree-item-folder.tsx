import { cond, T } from 'ramda'
import React, { FunctionComponent, useState, useEffect } from 'react'
import TreeItem from '@material-ui/lab/TreeItem'
import TreeItemEmptyFolder from './tree-item-empty-folder'
import TreeItemFile from './tree-item-file'
import TreeItemLoading from './tree-item-loading'

enum TContentType {
  Folder = 4,
  File = 8,
}

interface TContent {
  name: string
  type: TContentType
}

interface Props {
  path: string
  folderName: string
  onClickFile: (path: string) => void
}

const TreeItemFolder: FunctionComponent<Props> = ({ path, folderName, onClickFile }) => {
  const [contents, setContents] = useState<TContent[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [hasOpen, setHasOpen] = useState(false)

  useEffect(() => void (async () => {
    if (hasOpen === false) {
      return
    }

    setIsFetching(true)
    const response = await fetch(
      '/file-manager/list-directory-contents',
      {
        method: 'POST',
        body: JSON.stringify({ path }),
      }
    )

    const json = await response.json()
    setContents(json)
    setIsFetching(false)
  })(), [hasOpen])

  const handleOnClick = () => {
    setHasOpen(true)
    onClickFile(path)
  }

  const nodes = contents.map(i => (
    i.type === TContentType.Folder
      ? (<TreeItemFolder key={i.name} path={`${path}/${i.name}`} folderName={i.name} onClickFile={onClickFile} />)
      : (<TreeItemFile key={i.name} path={`${path}/${i.name}`} name={i.name} onClickFile={onClickFile} />)
  ))

  const child = cond([
    [
      () => isFetching,
      () => <TreeItemLoading path={path} />,
    ],
    [
      () => nodes.length === 0,
      () => <TreeItemEmptyFolder path={path} onClickFile={onClickFile} />,
    ],
    [
      T,
      () => nodes,
    ],
  ])()

  return (
    <TreeItem
      nodeId={path}
      label={folderName}
      onClick={handleOnClick}
    >
      {child}
    </TreeItem>
  )
}

export default TreeItemFolder

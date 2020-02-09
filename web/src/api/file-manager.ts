import { TContent } from '../types'

const apiFileManagerListDirectoryContents = async (path: string) => {
  type TApiFileManagerListDirectoryContentsJson = (
    {
      status: 'error'
      message: 'Directory does not exist'
    } |
    TContent[]
  )

  const response = await fetch(
    '/file-manager/list-directory-contents',
    {
      method: 'POST',
      body: JSON.stringify({ path }),
    }
  )

  const json: TApiFileManagerListDirectoryContentsJson = await response.json()

  return json
}

const apiFileManagerGetFileTextContent = async (path: string) => {
  type TApiFileManagerGetFileTextContent = (
    {
      status: 'error'
      message: 'Fail when tried to open this file' | 'It is not a text file'
    } |
    string
  )

  const response = await fetch(
    '/file-manager/get-file-text-content',
    {
      method: 'POST',
      body: JSON.stringify({ path }),
    }
  )

  if (response.headers.get('Content-Type') === 'application/json') {
    const json: TApiFileManagerGetFileTextContent = await response.json()
    return json
  }

  const text: TApiFileManagerGetFileTextContent = await response.text()
  return text
}

const apiFileManagerDownload = async (path: string) => {
  const response = await fetch(
    '/file-manager/download',
    {
      method: 'POST',
      body: JSON.stringify({ path }),
    }
  )

  const blob = await response.blob()

  const pathSplited = path.split('/')
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

export {
  apiFileManagerListDirectoryContents,
  apiFileManagerGetFileTextContent,
  apiFileManagerDownload,
}

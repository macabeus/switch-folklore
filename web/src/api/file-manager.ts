import { TContent } from '../types'
import wait from '../helpers/wait'

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

type TSetPercetage = (percentage: number) => void
const apiFileManagerUpload = (setPercentage: TSetPercetage, path: string) => (file: File) =>
  new Promise(async (resolve, reject) => {
    // Firstly we need to send a post request to set the path that the file will be saved
    const fullPath = `${path}/${file.name}`
    const response = await fetch(
      '/file-manager/upload',
      {
        method: 'POST',
        body: JSON.stringify({ path: fullPath }),
      }
    )
    const json = await response.json()
    if (json.status !== 'success') {
      reject(new Error('Fail on post request before the file upload!'))
      return
    }

    // Now we can do the file upload itself
    const req = new XMLHttpRequest()

    req.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        setPercentage((event.loaded / event.total) * 100)
      }
    })

    req.upload.addEventListener('load', async () => {
      await wait(1000)
      resolve(req.response)
    })

    req.upload.addEventListener('error', () => {
      reject(req.response)
    })

    const formData = new FormData()
    formData.append('file', file, file.name)
    req.open('POST', '/file-manager/upload')
    req.send(formData)
  })

export {
  apiFileManagerListDirectoryContents,
  apiFileManagerGetFileTextContent,
  apiFileManagerDownload,
  apiFileManagerUpload,
}

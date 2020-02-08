import wait from '../helpers/wait'

type TSetPercetage = (percentage: number) => void
const apiSwitchFolkloreUpload = (setPercentage: TSetPercetage) => (file: File) =>
  new Promise((resolve, reject) => {
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

    req.open('POST', '/switch-folklore/upload')
    req.send(formData)
  })

const apiSwitchFolkloreReplaceVersion = async () => {
  type TApiSwitchFolkloreReplaceVersionJson = (
    {
      status: 'error'
      message: string
    } |
    {
      status: 'success'
    }
  )

  const response = await fetch('/switch-folklore/replace-version')
  const json: TApiSwitchFolkloreReplaceVersionJson = await response.json()

  return json
}

const apiSwitchFolkloreRestart = async () => {
  type TApiSwitchFolkloreRestartJson = (
    {
      status: 'error'
      message: 'Fail when tried to restart'
    } |
    {
      status: 'success'
    }
  )

  let response: Response
  try {
    response = await fetch('/switch-folklore/restart')
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      // Since we'll have the connection lost because of the restart, the expected is that we'll receive this error
      location.reload()

      const result: TApiSwitchFolkloreRestartJson = {
        status: 'success',
      }

      return result
    }
  }

  const json: TApiSwitchFolkloreRestartJson = await response.json()

  return json
}

export {
  apiSwitchFolkloreUpload,
  TSetPercetage,
  apiSwitchFolkloreReplaceVersion,
  apiSwitchFolkloreRestart,
}

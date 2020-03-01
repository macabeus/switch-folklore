const apiProcess = async () => {
  type TApiProcessJson = (
    {
      status: 'error'
      message: 'Fail to get the process list'
    } |
    number[]
  )

  const response = await fetch('/process')
  const json: TApiProcessJson = await response.json()

  return json
}

export {
  apiProcess,
}

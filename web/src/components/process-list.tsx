import React, { FunctionComponent, useEffect, useState } from 'react'
import { last } from 'ramda'
import CircularProgress from '@material-ui/core/CircularProgress'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import { apiProcess } from '../api/process'

interface Props {
  selectedPid: number | null
  onChangeSelectedPid: (pid: number) => void
}

const ProcessList: FunctionComponent<Props> = ({ selectedPid, onChangeSelectedPid }) => {
  const [pidList, setPidList] = useState<number[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [shouldFetch, setShouldFetch] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    if (shouldFetch === false) {
      return
    }

    const fetchProcess = async () => {
      setIsFetching(true)
      const apiProcessResult = await apiProcess()
      setIsFetching(false)

      if ('status' in apiProcessResult) {
        setErrorMessage('Fail when tried to fetch the new process list.')
        return
      }

      setPidList(apiProcessResult)
      onChangeSelectedPid(last(apiProcessResult))
      setShouldFetch(false)
    }

    fetchProcess()
  }, [shouldFetch])

  if (errorMessage) {
    return (
      <Typography color='error'>
        Error: {errorMessage}
      </Typography>
    )
  }

  if (isFetching) {
    <div key='fetch'>
      <CircularProgress color='inherit' size={20} />
      Fetching...
    </div>
  }

  return (
    <Select
      value={selectedPid ? selectedPid : ''}
      onChange={event => onChangeSelectedPid(Number(event.target.value))}
    >
      {
        pidList.map(pid => (
          <MenuItem value={pid} key={pid}>{pid}</MenuItem>
        ))
      }
    </Select>
  )
}

export default ProcessList

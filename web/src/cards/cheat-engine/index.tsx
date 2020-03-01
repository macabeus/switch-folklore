import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ProcessList from '../../components/process-list'

const Process = () => {
  const [selectedPid, setSelectedPid] = useState<number | null>(null)

  return (
    <Card>
      <CardHeader title='Cheat Engine' />
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Typography>Process ID to attach</Typography>
            <ProcessList
              selectedPid={selectedPid}
              onChangeSelectedPid={setSelectedPid}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Process

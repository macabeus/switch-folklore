import React, { FunctionComponent } from 'react'
import Button, { ButtonProps } from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

interface Props extends ButtonProps {
  isLoading: boolean
}

const LoadingButton: FunctionComponent<Props> = ({ isLoading, children, ...props }) => (
  <Button
    endIcon={isLoading && (
      <CircularProgress size={16} />
    )}
    disabled={isLoading}
    {...props}
  >
    {children}
  </Button>
)

export default LoadingButton

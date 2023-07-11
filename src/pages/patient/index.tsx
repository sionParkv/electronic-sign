import { Container, Toolbar } from '@mui/material'
import React from 'react'

import COMP from '../../components'

const PatientPage = () => {
  const className = 'Pages HomePage'

  return (
    <Container className={className}>
      <COMP.Header />
      <Container>
        <Toolbar />
        PatientPage
      </Container>
      <COMP.Footer />
    </Container>
  )
}

export default PatientPage

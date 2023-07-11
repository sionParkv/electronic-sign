import { Container, Toolbar } from '@mui/material'
import React from 'react'

import COMP from '../components'

const HomePage = () => {
  const className = 'Pages HomePage'

  return (
    <Container className={className}>
      <COMP.Header />
      <Container>
        <Toolbar />
        HomePage
      </Container>
      <COMP.Footer />
    </Container>
  )
}

export default HomePage

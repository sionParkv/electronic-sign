import { Container } from '@mui/material'
import React from 'react'

import COMP from '../../components'

const PatientPage = () => {
  const className = 'Pages PatientPage'

  const propsHeader = {
    // TODO: 로그인 사용자 정보
    userInfo: '홍길동 CY DC00001'
  }

  return (
    <Container className={className}>
      <COMP.Header {...propsHeader} />
      <Container>
        <COMP.PatientInfo />
        <COMP.Document />
      </Container>
      <COMP.Footer />
    </Container>
  )
}

export default PatientPage

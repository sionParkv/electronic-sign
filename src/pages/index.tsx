import { Container, Toolbar } from '@mui/material'
import React from 'react'

import COMP from '../components'

const HomePage = () => {
  const className = 'Pages HomePage'

  const propsHeader = {
    // TODO: 로그인 사용자 정보
    userInfo: '홍길동 CY DC00001'
  }

  return (
    <Container className={className}>
      <COMP.Header {...propsHeader} />
      <Container className="PageWrapper">
        <Toolbar />
        <Container className="Contents">
          <COMP.SearchBar />
        </Container>
      </Container>
      <COMP.Footer />
    </Container>
  )
}

export default HomePage

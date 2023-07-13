import {
  Box,
  Button,
  Container,
  Typography as T,
  TextField
} from '@mui/material'
import Image from 'next/image'
import React from 'react'

import Footer from '../../components/Footer'
import IMGS from '../../assets/images'

const LoginPage = () => {
  const className = 'Pages LoginPage'

  return (
    <Container className={className}>
      <Box className="Logo">
        <Image src={IMGS.Logo} alt="Logo" />
      </Box>
      <Box className="LoginBox">
        <T component="h1">MOBILE CONSENT SYSTEM</T>
        <T component="h2">모바일 전자동의서 시스템</T>
        <Box className="LoginText">
          <Box>
            <T>사번</T>
            <T>|</T>
            <TextField />
          </Box>
          <Box>
            <T>이름</T>
            <T>|</T>
            <TextField />
          </Box>
          <Box>
            <T>부서</T>
            <T>|</T>
            <TextField />
          </Box>
          <Box>
            <T>비밀번호</T>
            <T>|</T>
            <TextField type="password" />
          </Box>
        </Box>
        <Box className="LoginBtn">
          <Button>로그인</Button>
        </Box>
      </Box>
      <Footer />
    </Container>
  )
}

export default LoginPage

import {
  Box,
  Button,
  Container,
  Typography as T,
  TextField
} from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'
import axios from 'axios'

import Footer from '../../components/Footer'
import IMGS from '../../assets/images'

const LoginPage = () => {
  const [values, setValues] = useState({
    empNo: '',
    password: ''
  })
  const className = 'Pages LoginPage'

  const handleChangeEmpNo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, empNo: event.target.value })
  }

  const handleLogin = () => {
    console.log({
      EMPL_NO: values.empNo,
      PASS_WORD: values.password
    })

    if (!values.empNo.length) {
      alert('이름을 입력해 줘!')
      document.getElementsByTagName('input')[0].focus()
    }

    axios
      .post('/api/login', {
        EMPL_NO: values.empNo,
        PASS_WORD: ''
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch(() => {
        alert('오류가 발생하였습니다.')
      })
  }

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
            <TextField
              defaultValue={values.empNo}
              onChange={handleChangeEmpNo}
            />
          </Box>
          <Box>
            <T>이름</T>
            <TextField />
          </Box>
          <Box>
            <T>부서</T>
            <TextField />
          </Box>
          <Box>
            <T>비밀번호</T>
            <TextField type="password" defaultValue={values.password} />
          </Box>
        </Box>
        <Box className="LoginBtn">
          <Button onClick={handleLogin}>로그인</Button>
        </Box>
      </Box>
      <Footer />
    </Container>
  )
}

export default LoginPage

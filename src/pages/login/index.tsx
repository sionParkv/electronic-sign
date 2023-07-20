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

import components from '@/components'
import IMGS from '../../assets/images'

const LoginPage = () => {
  const [empNo, setEmpNo] = useState('')
  const [pw, setPw] = useState('')
  const className = 'Pages LoginPage'

  const handleChangeEmpNo = (e: any) => {
    const empNoValue = e.target.value
    setEmpNo(empNoValue)
  }

  const handleChangePw = (e: any) => {
    const pwValue = e.target.value
    setPw(pwValue)
  }

  const handleLogin = () => {
    console.log({
      EMPL_NO: empNo,
      PASS_WORD: pw
    })

    if (!empNo.length) {
      alert('사번을 입력해주세요')
      document.getElementsByTagName('input')[0].focus()
    }

    axios
      .post('/api/login', {
        EMPL_NO: empNo,
        PASS_WORD: pw
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
      <components.Alert />
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
              defaultValue={empNo}
              value={empNo}
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
            <TextField
              type="password"
              defaultValue={pw}
              value={pw}
              onChange={handleChangePw}
            />
          </Box>
        </Box>
        <Box className="LoginBtn">
          <Button onClick={handleLogin}>로그인</Button>
        </Box>
      </Box>
      <components.Footer />
    </Container>
  )
}

export default LoginPage

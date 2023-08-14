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
import { useRouter } from 'next/router'
import { hasCookie } from 'cookies-next'

const LoginPage = () => {
  const [empNo, setEmpNo] = useState('')
  const [pw, setPw] = useState('')
  const className = 'Pages LoginPage'
  const router = useRouter()

  if (hasCookie('loginCookie')) {
    router.push('/')
  }

  const handleChangeEmpNo = (e: any) => {
    const empNoValue = e.target.value
    setEmpNo(empNoValue)
  }

  const handleChangePw = (e: any) => {
    const pwValue = e.target.value
    setPw(pwValue)
  }

  const inputValue = () => {
    axios
      .post('/api/login', {
        EMPL_NO: empNo,
        PASS_WORD: pw
      })
      .then((response) => {
        if (response.data.code === 'OK') {
          document.getElementsByTagName('input')[1].value =
            response.data.data[0].EMPL_NM
          document.getElementsByTagName('input')[2].value =
            response.data.data[0].DEPT_GB
        }
      })
  }

  const handleLogin = () => {
    if (!empNo.length) {
      return components.openConfirmDialog({
        contents: '사번을 입력해주세요',
        ok: {
          label: '닫기',
          action: () => {
            setTimeout(() => {
              document.getElementsByTagName('input')[0].focus()
            }, 50)
          }
        },
        title: '입력 오류'
      })
    } else if (!pw.length) {
      return components.openConfirmDialog({
        contents: '비밀번호를 입력해주세요',
        ok: {
          label: '닫기',
          action: () => {
            setTimeout(() => {
              document.getElementsByTagName('input')[3].focus()
            }, 50)
          }
        },
        title: '입력 오류'
      })
    }

    axios
      .post('/api/login', {
        EMPL_NO: empNo,
        PASS_WORD: pw
      })
      .then((response) => {
        if (response.data.code === 'OK') {
          console.log(response.data.data[0].EMPL_NM)

          router.push('/')
        } else {
          components.openConfirmDialog({
            contents: response.data.message,
            ok: {
              label: '닫기',
              action: () => {
                setTimeout(() => {
                  document.getElementsByTagName('input')[0].focus()
                }, 50)
              }
            },
            title: '입력 오류'
          })
        }
      })
      .catch((error) => {
        alert(error.message)
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
              defaultValue={empNo}
              onChange={handleChangeEmpNo}
              placeholder="필수입력"
              onBlur={inputValue}
            />
          </Box>
          <Box className="Nmae">
            <T>이름</T>
            <TextField disabled />
          </Box>
          <Box className="Dept">
            <T>부서</T>
            <TextField disabled />
          </Box>
          <Box>
            <T>비밀번호</T>
            <TextField
              type="password"
              defaultValue={pw}
              onChange={handleChangePw}
            />
          </Box>
        </Box>
        <Box className="LoginBtn">
          <Button
            onClick={() => {
              handleLogin()
            }}
          >
            로그인
          </Button>
        </Box>
      </Box>
      <components.Footer />
    </Container>
  )
}

export default LoginPage

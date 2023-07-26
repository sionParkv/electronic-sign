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
  const [empNm, setEmpNm] = useState('')
  const [dept, setDept] = useState('')
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

  const handleChangeEmpNm = (e: any) => {
    const empNmValue = e.target.value
    setEmpNm(empNmValue)
  }

  const handleChangeDept = (e: any) => {
    const pwValue = e.target.value
    setDept(pwValue)
  }

  const handleLogin = () => {
    console.log({
      EMPL_NO: empNo,
      PASS_WORD: pw
    })

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
    } else if (!empNm.length) {
      return components.openConfirmDialog({
        contents: '이름을 입력해주세요',
        ok: {
          label: '닫기',
          action: () => {
            setTimeout(() => {
              document.getElementsByTagName('input')[1].focus()
            }, 50)
          }
        },
        title: '입력 오류'
      })
    } else if (!dept.length) {
      return components.openConfirmDialog({
        contents: '부서를 입력해주세요',
        ok: {
          label: '닫기',
          action: () => {
            setTimeout(() => {
              document.getElementsByTagName('input')[2].focus()
            }, 50)
          }
        },
        title: '입력 오류'
      })
    }

    axios
      .post('/api/login', {
        EMPL_NO: empNo,
        EMPL_NM: empNm,
        DEPT: dept,
        PASS_WORD: pw
      })
      .then((response) => {
        console.log('response.data:: ', response.data)
        if (response.data.code === 'OK') {
          router.push('/')
        } else {
          components.openConfirmDialog({
            contents: response.data.message,
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
            <TextField defaultValue={empNo} onChange={handleChangeEmpNo} />
          </Box>
          <Box>
            <T>이름</T>
            <TextField defaultValue={empNm} onChange={handleChangeEmpNm} />
          </Box>
          <Box>
            <T>부서</T>
            <TextField defaultValue={dept} onChange={handleChangeDept} />
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

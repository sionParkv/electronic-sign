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
  const [userInfo, setUserInfo] = useState({
    name: '',
    dept: ''
  })

  if (hasCookie('loginCookie')) {
    router.push('/')
  }

  const handleChangePw = (e: any) => {
    const pwValue = e.target.value
    setPw(pwValue)
  }

  const handleEmpNo = (e: React.FocusEvent<HTMLInputElement>) => {
    const EMPL_NO = e.target.value
    setEmpNo(EMPL_NO)

    if (!EMPL_NO) return
    if (EMPL_NO !== empNo) {
      axios
        .post('/api/login', {
          EMPL_NO,
          PASS_WORD: pw,
          CODE: 'EMPL_NO_CHECK'
        })
        .then((response) => {
          const result = response.data
          if (result.code === 'OK') {
            const data = result.data[0]
            setUserInfo({
              name: data.EMPL_NM,
              dept: data.DEPT_GB
            })
            return
          } else if (result.code === 'FAIL') {
            setUserInfo({ name: '', dept: '' })
            setPw('')
            components.openConfirmDialog({
              contents: result.message,
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
            return
          }
        })
        .catch(() => {
          components.openConfirmDialog({
            contents: (
              <>
                전산상의 오류가 발생했습니다. <br /> 다음에 다시 시도해주세요.
              </>
            ),
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
          return
        })
    }
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
        PASS_WORD: pw,
        CODE: 'LOGIN'
      })
      .then((response) => {
        if (response.data.code === 'OK') {
          router.push('/')
        } else {
          components.openConfirmDialog({
            contents: (
              <>
                입력한 결과와 일치하는 <br />
                직원 정보가 없습니다.
              </>
            ),
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
        <Image src={IMGS.Logo} alt="Logo" width="143" height="30" />
      </Box>
      <Box className="LoginBox">
        <T component="h1">MOBILE CONSENT SYSTEM</T>
        <T component="h2">모바일 전자동의서 시스템</T>
        <Box className="LoginText" component="form">
          <Box>
            <T>사번</T>
            <TextField
              defaultValue={empNo}
              onBlur={handleEmpNo}
              placeholder="사번 입력"
              type="number"
            />
          </Box>
          <Box className="Name">
            <T>이름</T>
            <TextField
              InputProps={{ readOnly: true }}
              placeholder="사번 일치 시 자동 입력"
              value={userInfo.name}
            />
          </Box>
          <Box className="Dept">
            <T>부서</T>
            <TextField
              InputProps={{ readOnly: true }}
              placeholder="사번 일치 시 자동 입력"
              value={userInfo.dept}
            />
          </Box>
          <Box>
            <T>비밀번호</T>
            <TextField
              type="password"
              value={pw}
              placeholder="비밀번호 입력"
              onChange={handleChangePw}
              autoComplete="off"
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

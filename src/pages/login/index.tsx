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

interface UserInfo {
  name: string
  dept: string
}

/**
 * 로그인 페이지 컴포넌트
 * @returns {React.ReactNode} 로그인 페이지 컴포넌트
 */
const LoginPage = () => {
  const [empNo, setEmpNo] = useState('') // 사용자 사번 상태
  const [pw, setPw] = useState('') // 사용자 비밀번호 상태
  const className = 'Pages LoginPage'
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    dept: ''
  }) // 사용자 정보 상태  (이름, 부서)

  // 이미 로그인된 사용자는 홈 페이지로 리다이렉트
  if (hasCookie('loginCookie')) {
    router.push('/')
  }

  const openErrorDialog = (contents: React.ReactNode) => {
    components.openConfirmDialog({
      contents,
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

  const axiosRequest = (emplNo: string, passWord: string, code: string) => {
    axios
      .post('/api/login', {
        EMPL_NO: emplNo,
        PASS_WORD: passWord,
        CODE: code
      })
      .then((response) => {
        const result = response.data
        if (code === 'LOGIN') {
          if (response.data.code === 'OK') {
            // 로그인 성공 시 홈 페이지로 이동하고 탭 초기화
            router.push('/')
            localStorage.setItem('newTab', '0')
          } else {
            // 로그인 실패 시 오류 메시지 표시
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
        } else if (code === 'EMPL_NO_CHECK') {
          if (result.code === 'OK') {
            const data = result.data[0]
            setUserInfo({
              name: data.EMPL_NM,
              dept: data.DEPT_GB
            }) // 사용자 정보 업데이트
          } else if (result.code === 'FAIL') {
            setUserInfo({ name: '', dept: '' })
            setPw('')
            openErrorDialog(result.message)
          }
        }
      })
      .catch(() => {
        openErrorDialog(
          <>
            전산상의 오류가 발생했습니다. <br /> 다음에 다시 시도해주세요.
          </>
        )
      })
  }

  // 비밀번호 변경 핸들러
  const handleChangePw = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwValue = e.target.value
    setPw(pwValue)
  }

  // 사번 입력 핸들러
  const handleEmpNo = (e: React.FocusEvent<HTMLInputElement>) => {
    const EMPL_NO = e.target.value
    setEmpNo(EMPL_NO)

    if (!EMPL_NO) return

    if (EMPL_NO !== empNo) {
      axiosRequest(EMPL_NO, pw, 'EMPL_NO_CHECK')
    }
  }

  // 로그인 버튼 클릭 핸들러
  const handleLogin = () => {
    if (!empNo.length) {
      // 사번이 입력되지 않은 경우 오류 메시지 표시
      openErrorDialog('사번을 입력해주세요')
      return
    } else if (!pw.length) {
      // 비밀번호가 입력되지 않은 경우 오류 메시지 표시
      openErrorDialog('비밀번호를 입력해주세요')
      return
    } else {
      axiosRequest(empNo, pw, 'LOGIN')
    }
  }

  // 컴포넌트 반환
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

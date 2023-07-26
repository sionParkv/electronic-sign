import { Container } from '@mui/material'
import React, { useEffect, useState } from 'react'

import COMP from '../../components'
import { getCookie, hasCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { AES256 } from '@/utils/AES256'

const PatientPage = () => {
  const className = 'Pages PatientPage'
  const [userInfo, setUserInfo] = useState<string>('')
  const router = useRouter()

  const propsHeader = {
    // TODO: 로그인 사용자 정보
    userInfo: userInfo
  }

  let cookie = getCookie('loginCookie')
  let tempCookie
  let cookieArray: any = []
  if (hasCookie('loginCookie')) {
    tempCookie = AES256.AES_decrypt(cookie)
    cookieArray = JSON.parse(tempCookie)
  }

  useEffect(() => {
    if (!hasCookie('loginCookie')) {
      router.push('/login')
    }
    cookieArray
      ? setUserInfo(
          `${cookieArray[0].EMPL_NM} ${cookieArray[0].DEPT_CD} ${cookieArray[0].EMPL_NO} 님`
        )
      : ''
  }, [])

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

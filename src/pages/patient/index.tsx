import { Container } from '@mui/material'
import React, { useEffect, useState } from 'react'

import components from '../../components'
import { getCookie, hasCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { AES256 } from '@/utils/AES256'

const PatientPage = () => {
  const className = 'Pages PatientPage '
  const [userInfo, setUserInfo] = useState<string>('')
  const router = useRouter()

  const propsHeader = {
    userInfo: userInfo
  }

  let cookie = getCookie('loginCookie')
  let tempCookie
  let loginCookie: any = []
  if (hasCookie('loginCookie')) {
    tempCookie = AES256.AES_decrypt(cookie)
    loginCookie = JSON.parse(tempCookie)
  }

  useEffect(() => {
    if (!hasCookie('loginCookie')) {
      router.push('/login')
    } else {
      if (loginCookie.length) {
        const { EMPL_NM, DEPT_CD, EMPL_NO } = loginCookie[0]
        setUserInfo(`${EMPL_NM} ${DEPT_CD} ${EMPL_NO} 님`)
      }
    }
  }, [])

  return (
    <Container className={className}>
      {/* {hasCookie('loginCookie') && (
        <React.Fragment> */}
      <components.Header {...propsHeader} />
      <Container className="Contents">
        <components.PatientInfo />
        <components.Document userInfo={userInfo} />
      </Container>
      <components.Footer />
      {/* </React.Fragment>
      )} */}
    </Container>
  )
}

export default PatientPage

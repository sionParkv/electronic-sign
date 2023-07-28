import { Box, Container, Tab, Tabs } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getCookie, hasCookie } from 'cookies-next'

import components from '@/components'
import { AES256 } from '@/utils/AES256'
import { useRouter } from 'next/router'
import { useStateValue, useDispatch } from '@/context/stateContext'

interface TabPanelProps {
  children: React.ReactNode
  index: number
  value: number
}

const PatientListTabPanel = (props: TabPanelProps) => {
  const { children, index, value } = props
  return (
    <Container className="TabPanel" hidden={value != index}>
      {value === index && <Box className="Panel">{children}</Box>}
    </Container>
  )
}

const HomePage = () => {
  const router = useRouter()
  const state = useStateValue()
  const dispatch = useDispatch()
  const [tab, setTab] = useState<number>(0)
  const [userInfo, setUserInfo] = useState<string>('')
  const className = 'Pages HomePage'

  const handleStateChange = (newList: any) => {
    if (dispatch) {
      dispatch({ type: 'PATIENT_LIST', list: newList })
    }
  }
  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    localStorage.setItem('newTab', newTab.toString())
    setTab(newTab)
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
    } else {
      cookieArray
        ? setUserInfo(
            `${cookieArray[0].EMPL_NM} ${cookieArray[0].DEPT_CD} ${cookieArray[0].EMPL_NO} 님`
          )
        : ''
      const getItem = parseInt(localStorage.getItem('newTab')!)
      setTab(getItem ? getItem : 0)
    }
  }, [])

  const propsHeader = {
    // TODO: 로그인 사용자 정보
    userInfo: userInfo
  }

  return (
    <Container className={className}>
      <components.Header {...propsHeader} />
      <Container className="PageWrapper">
        <Container className="Contents">
          {tab === 0 && (
            <components.AdmissionSearch
              state={state}
              handleStateChange={handleStateChange}
            />
          )}
          {tab === 1 && (
            <components.OutPatientSearch
              state={state}
              handleStateChange={handleStateChange}
            />
          )}
          {tab === 2 && (
            <components.SurgerySearch
              state={state}
              handleStateChange={handleStateChange}
            />
          )}
          <Container className="TabContainer">
            <Box>
              <Tabs value={tab} onChange={handleChange} variant="fullWidth">
                <Tab label="입원" />
                <Tab label="외래" />
                <Tab label="수술" />
              </Tabs>
            </Box>
            <PatientListTabPanel value={tab} index={0}>
              <components.PatientList tabValue={tab} />
            </PatientListTabPanel>
            <PatientListTabPanel value={tab} index={1}>
              <components.PatientList tabValue={tab} />
            </PatientListTabPanel>
            <PatientListTabPanel value={tab} index={2}>
              <components.PatientList tabValue={tab} />
            </PatientListTabPanel>
          </Container>
        </Container>
      </Container>
      <components.Footer />
    </Container>
  )
}

export default HomePage

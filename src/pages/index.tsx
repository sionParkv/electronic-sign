import { Box, Container, Tab, Tabs } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getCookie, hasCookie } from 'cookies-next'

import components from '@/components'
import { AES256 } from '@/utils/AES256'
import { useRouter } from 'next/router'
import { useStateValue, useDispatch } from '@/context/stateContext'
import axios from 'axios'
import moment from 'moment'

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

  const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
    localStorage.setItem('newTab', newTab.toString())
    setTab(newTab)
    localStorage.removeItem('filters')
  }

  let cookie = getCookie('loginCookie')
  let decodeCookie
  let loginCookie: any = []
  if (hasCookie('loginCookie')) {
    decodeCookie = AES256.AES_decrypt(cookie)
    loginCookie = JSON.parse(decodeCookie)
  }

  useEffect(() => {
    if (!hasCookie('loginCookie')) {
      router.push('/login')
    } else {
      if (loginCookie.length) {
        const { EMPL_NM, DEPT_CD, EMPL_NO } = loginCookie[0]
        setUserInfo(`${EMPL_NM} ${DEPT_CD} ${EMPL_NO} 님`)
      }

      const getItem = parseInt(localStorage.getItem('newTab')!)
      setTab(getItem ? getItem : 0)

      const patientList = localStorage.getItem('patientList') || '{}'
      const jsonPatientList = JSON.parse(patientList)
      const existsAdmission = jsonPatientList?.admission?.length
      const existsOutpatient = jsonPatientList?.outpatient?.length
      const existsSurgery = jsonPatientList?.surgery?.length

      if (getItem === 0 && !existsAdmission) {
        axios
          .post('/api/admission', {
            DEPT_CD: 'ALL',
            WARD_CD: 'ALL',
            PTNT_NM: ''
          })
          .then((response) => {
            if (response.data.data) {
              localStorage.setItem(
                'patientList',
                `{"admission":${JSON.stringify(response.data.data)}}`
              )
              handleStateChange(response.data.data)
            } else {
              localStorage.setItem(
                'patientList',
                `{"admission":${JSON.stringify([])}}`
              )
              handleStateChange([])
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else if (getItem === 1 && !existsOutpatient) {
        const today = moment()
        axios
          .post('/api/outPatient', {
            // CLINIC_YMD: '20220603',
            // TODO: 임시 테스트를 위해 날짜 고정
            CLINIC_YMD: today.format('YYYYMMDD'),
            DEPT_CD: 'ALL',
            DOCT_EMPL_NO: 'ALL',
            PTNT_NM: ''
          })
          .then((response) => {
            if (response.data.data) {
              localStorage.setItem(
                'patientList',
                `{"outPatient":${JSON.stringify(response.data.data)}}`
              )
              handleStateChange(response.data.data)
              return
            } else {
              localStorage.setItem(
                'patientList',
                `{"outPatient":${JSON.stringify([])}}`
              )
              handleStateChange([])
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else if (getItem === 2 && !existsSurgery) {
        const today = moment()
        axios
          .post('/api/surgery', {
            OP_YMD: today.format('YYYYMMDD'),
            OP_DEPT_CD: '-',
            AN_TYPE_GB: '-',
            OP_GB: '-',
            PTNT_NM: ''
          })
          .then((response) => {
            if (response.data.data) {
              localStorage.setItem(
                'patientList',
                `{"surgery":${JSON.stringify(response.data.data)}}`
              )
              handleStateChange(response.data.data)
              return
            } else {
              localStorage.setItem(
                'patientList',
                `{"surgery":${JSON.stringify([])}}`
              )
              handleStateChange([])
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }, [tab])

  const propsHeader = {
    userInfo: userInfo
  }
  return (
    <Container className={className}>
      {/* {hasCookie('loginCookie') && (
        <React.Fragment> */}
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
              <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
                <Tab label="입원" />
                <Tab label="외래" />
                <Tab label="수술" />
              </Tabs>
            </Box>
            <React.Fragment>
              <PatientListTabPanel value={tab} index={0}>
                <components.PatientList tabValue={tab} />
              </PatientListTabPanel>
              <PatientListTabPanel value={tab} index={1}>
                <components.PatientList tabValue={tab} />
              </PatientListTabPanel>
              <PatientListTabPanel value={tab} index={2}>
                <components.PatientList tabValue={tab} />
              </PatientListTabPanel>
            </React.Fragment>
          </Container>
        </Container>
      </Container>
      <components.Footer />
      {/* </React.Fragment>
      )} */}
    </Container>
  )
}

export default HomePage

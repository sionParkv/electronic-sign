import { Box, Container, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'

import components from '@/components'

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
  const [tab, setTab] = useState<number>(0)
  const className = 'Pages HomePage'

  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab)
  }

  const propsHeader = {
    // TODO: 로그인 사용자 정보
    userInfo: '홍길동 CY DC00001'
  }

  return (
    <Container className={className}>
      <components.Header {...propsHeader} />
      <Container className="PageWrapper">
        <Container className="Contents">
          {tab === 0 && <components.AdmissionSearch />}
          {tab === 1 && <components.OutPatientSearch />}
          {tab === 2 && <components.SurgerySearch />}
          <Container className="TabContainer">
            <Box>
              <Tabs value={tab} onChange={handleChange}>
                <Tab label="입원" />
                <Tab label="외래" />
                <Tab label="수술" />
              </Tabs>
            </Box>
            <PatientListTabPanel value={tab} index={0}>
              <components.PatientList />
            </PatientListTabPanel>
            <PatientListTabPanel value={tab} index={1}>
              <components.PatientList />
            </PatientListTabPanel>
            <PatientListTabPanel value={tab} index={2}>
              <components.PatientList />
            </PatientListTabPanel>
          </Container>
        </Container>
      </Container>
      <components.Footer />
    </Container>
  )
}

export default HomePage

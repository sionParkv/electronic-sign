import { Box, Container, Tab, Tabs, Toolbar } from '@mui/material'
import React, { useState } from 'react'

import COMP from '../components'

interface TabPanelProps {
  children: React.ReactNode
  index: Number
  value: Number
}

const PatientListTabPanel = (props: TabPanelProps) => {
  const { children, index, value } = props

  return (
    <Container className="TabPanel" hidden={value != index}>
      {value === index && <Box>{children}</Box>}
    </Container>
  )
}

const HomePage = () => {
  const [tab, setTab] = useState<Number>(0)
  const className = 'Pages HomePage'

  const handleChange = (event: React.SyntheticEvent, newTab: Number) => {
    setTab(newTab)
  }

  const propsHeader = {
    // TODO: 로그인 사용자 정보
    userInfo: '홍길동 CY DC00001'
  }

  return (
    <Container className={className}>
      <COMP.Header {...propsHeader} />
      <Container className="PageWrapper">
        <Container className="Contents">
          <COMP.SearchBar />
          <Container className="TabContainer">
            <Box>
              <Tabs value={tab} onChange={handleChange}>
                <Tab label="입원" />
                <Tab label="외래" />
                <Tab label="수술" />
              </Tabs>
            </Box>
            <PatientListTabPanel value={tab} index={0}>
              입원 환자 목록
            </PatientListTabPanel>
            <PatientListTabPanel value={tab} index={1}>
              외래 환자 목록
            </PatientListTabPanel>
            <PatientListTabPanel value={tab} index={2}>
              수술 환자 목록
            </PatientListTabPanel>
          </Container>
        </Container>
      </Container>
      <COMP.Footer />
    </Container>
  )
}

export default HomePage

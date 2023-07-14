import {
  Box,
  Container,
  List,
  ListItem,
  Typography as T,
  Tab,
  Tabs
} from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'

import images from '@/assets/images'

interface TabPanelProps {
  children: React.ReactNode
  index: number
  value: number
}

const DocumentListTabPanel = (props: TabPanelProps) => {
  const { children, index, value } = props

  return (
    <Container className="TabPanel" hidden={value != index}>
      {value === index && <Box className="Panel">{children}</Box>}
    </Container>
  )
}

const DocumentListContainer = (props: { children: React.ReactNode }) => {
  const { children } = props

  return <Container className="DocumentListContainer">{children}</Container>
}

const Document = () => {
  const [tabL, setTabL] = useState<number>(0)
  const [tabR, setTabR] = useState<number>(0)

  const handleChangeL = (event: React.SyntheticEvent, newTab: number) => {
    setTabL(newTab)
  }

  const handleChangeR = (event: React.SyntheticEvent, newTab: number) => {
    setTabR(newTab)
  }

  return (
    <Container className="DocumentContainer">
      <Box className="DocumentBox">
        <Box className="DocumentTitle">
          <Image src={images.DocumentIcon} alt="icon" />
          <T>작성서식 목록</T>
        </Box>
        <Box className="TabContainer">
          <Box>
            <Tabs value={tabL} onChange={handleChangeL}>
              <Tab label="임시저장 서식" />
              <Tab label="작성완료 서식" />
            </Tabs>
          </Box>
          <DocumentListTabPanel value={tabL} index={0}>
            <DocumentListContainer>
              <List className="DocumentList">
                <ListItem>
                  <T className="Title">표준 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
              </List>
            </DocumentListContainer>
          </DocumentListTabPanel>
          <DocumentListTabPanel value={tabL} index={1}>
            <DocumentListContainer>
              <List className="DocumentList">
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
                <ListItem>
                  <T className="Title">완료된 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
              </List>
            </DocumentListContainer>
          </DocumentListTabPanel>
        </Box>
      </Box>
      <Box className="DocumentBox">
        <Box className="DocumentTitle">
          <Image src={images.DocumentIcon} alt="icon" />
          <T>서식 목록</T>
        </Box>
        <Box className="TabContainer">
          <Box>
            <Tabs value={tabR} onChange={handleChangeR}>
              <Tab label="즐겨찾기" />
              <Tab label="전체" />
            </Tabs>
          </Box>
          <DocumentListTabPanel value={tabR} index={0}>
            <DocumentListContainer>
              <List className="DocumentList">
                <ListItem>
                  <T className="Title">즐겨찾기 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
              </List>
            </DocumentListContainer>
          </DocumentListTabPanel>
          <DocumentListTabPanel value={tabR} index={1}>
            <DocumentListContainer>
              <List className="DocumentList">
                <ListItem>
                  <T className="Title">일반 공통 수술시술검사 동의서</T>
                  <T className="Date">2023.06.14 12:56</T>
                </ListItem>
              </List>
            </DocumentListContainer>
          </DocumentListTabPanel>
        </Box>
      </Box>
    </Container>
  )
}
export default Document

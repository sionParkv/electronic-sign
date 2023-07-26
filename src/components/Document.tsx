import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  Typography as T,
  Tab,
  Tabs
} from '@mui/material'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import images from '@/assets/images'
import axios from 'axios'
import { useRouter } from 'next/router'
import { getCookie, hasCookie } from 'cookies-next'
import { AES256 } from '@/utils/AES256'

interface TabPanelProps {
  children: React.ReactNode
  index: number
  value: number
}

interface Patient {
  [key: string]: any
  name: string
  date: string
  number: number
  diagnosis: string
  doctor: string
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
  let patInfoList: any = ''
  const [tabL, setTabL] = useState<number>(0)
  const [tabR, setTabR] = useState<number>(0)

  const [pat, setPat] = useState<Patient[]>([])
  const [tempList, setTempList] = useState([])
  const [givenList, setGivenList] = useState([])
  const [list, setList] = useState([])
  const [favoritelist, setFavoriteList] = useState([])
  const router = useRouter()

  const handleChangeL = (event: React.SyntheticEvent, newTab: number) => {
    setTabL(newTab)
  }

  const handleChangeR = (event: React.SyntheticEvent, newTab: number) => {
    setTabR(newTab)
  }
  let tempObject: any = []
  if (hasCookie('loginCookie')) {
    let temp = getCookie('loginCookie')
    let temp2 = AES256.AES_decrypt(temp)
    tempObject = JSON.parse(temp2)
  }

  useEffect(() => {
    if (localStorage.getItem('patientInfo') !== 'undefined') {
      tempMethod()
    }
  }, [])

  const tempMethod = () => {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('patientInfo') !== 'undifined'
    ) {
      patInfoList = JSON.parse(localStorage.getItem('patientInfo')!)
      setPat(patInfoList)
      // patInfo = patInfoList as String)!
    }
  }
  console.log(tempList)

  const loadItems = async () => {
    await axios
      .post('/api/tempList', {
        PTNT_NO: pat.number
      })
      .then((response) => {
        setTempList(response.data.data)
        console.log(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })

    await axios
      .post('/api/givenList', {
        PTNT_NO: pat.number
      })
      .then((response) => {
        setGivenList(response.data.data)
        console.log(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })

    await axios
      .get('/api/List')
      .then((response) => {
        setList(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })

    await axios
      .post('/api/favoriteList', {
        EMPL_NO: tempObject[0].EMPL_NO
      })
      .then((response) => {
        setFavoriteList(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const backPage = () => {
    router.push('/')
  }

  useEffect(() => {
    loadItems()
  }, [])

  return (
    <Container className="DocumentContainer">
      <Box className="Division">
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
                  {tempList ? (
                    tempList.map((index: any, i) => (
                      <ListItem key={i}>
                        <T className="Title">{index.FORM_NM}</T>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <T className="Title"> 임시저장 서식이 없습니다.</T>
                    </ListItem>
                  )}
                </List>
              </DocumentListContainer>
            </DocumentListTabPanel>
            <DocumentListTabPanel value={tabL} index={1}>
              <DocumentListContainer>
                <List className="DocumentList">
                  {givenList ? (
                    givenList.map((index: any, i) => (
                      <ListItem key={i}>
                        <T className="Title">{index.FORM_NM}</T>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <T className="Title"> 작성완료 서식이 없습니다.</T>
                    </ListItem>
                  )}
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
                  {favoritelist &&
                    favoritelist.map((index: any, i) => (
                      <ListItem key={i}>
                        <T className="Title">{index.FORM_NM}</T>
                      </ListItem>
                    ))}
                </List>
              </DocumentListContainer>
            </DocumentListTabPanel>
            <DocumentListTabPanel value={tabR} index={1}>
              <DocumentListContainer>
                <List className="DocumentList">
                  {list &&
                    list.map((index: any, i) => (
                      <ListItem key={i}>
                        <T className="Title">{index.FORM_NM}</T>
                      </ListItem>
                    ))}
                </List>
              </DocumentListContainer>
            </DocumentListTabPanel>
          </Box>
        </Box>
      </Box>
      <Box className="ButtonBox">
        <Button className="list" onClick={backPage}>
          목록
        </Button>
      </Box>
    </Container>
  )
}
export default Document

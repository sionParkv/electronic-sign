/**
 * 문서 목록 컴포넌트
 */

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import images from '@/assets/images'
import axios from 'axios'
import { useRouter } from 'next/router'
import { getCookie, hasCookie } from 'cookies-next'
import { AES256 } from '@/utils/AES256'
import components from '.'

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

const initialPatient: Patient = {
  name: '',
  date: '',
  number: 0,
  diagnosis: '',
  doctor: ''
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

const Document = (userInfo: any) => {
  const user = userInfo.userInfo

  let patInfoList: any = ''
  const [tabL, setTabL] = useState<number>(0)
  const [tabR, setTabR] = useState<number>(0)

  const [accordionNo, setAccordionNo] = useState<number>(-1)

  const [pat, setPat] = useState<Patient>(initialPatient)
  const [tempList, setTempList] = useState([])
  const [givenList, setGivenList] = useState([])
  const [list, setList] = useState([])
  const [favoriteList, setFavoriteList] = useState([])
  const router = useRouter()

  // 작성서식 목록 탭 상태관리
  const handleChangeL = (event: React.SyntheticEvent, newTab: number) => {
    setTabL(newTab)
  }
  // 서식 목록 탭 상태관리
  const handleChangeR = (event: React.SyntheticEvent, newTab: number) => {
    setTabR(newTab)
  }
  // 전체 문서 아코디언 상태관리
  const accordionChange =
    (index: number) => (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      if (isExpanded) {
        setAccordionNo(index)
      } else {
        setAccordionNo(-1)
      }
    }

  // 쿠기 있을 시 자동 로그인
  let tempObject: any = []
  if (hasCookie('loginCookie')) {
    let temp = getCookie('loginCookie')
    let temp2 = AES256.AES_decrypt(temp)
    tempObject = JSON.parse(temp2)
  }

  useEffect(() => {
    if (localStorage.getItem('patientInfo') !== 'undefined') {
      patMethod()
    }
  }, [])

  const patMethod = () => {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('patientInfo') !== 'undefined'
    ) {
      patInfoList = JSON.parse(localStorage.getItem('patientInfo')!)
      setPat(patInfoList)
    }
  }

  // 문서 api 호출
  const loadItems = async () => {
    await axios
      .post('/api/tempList', {
        PTNT_NO: pat.number
      })
      .then((response) => {
        setTempList(response.data.data)
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
        EMPL_NO: tempObject[0]?.EMPL_NO
      })
      .then((response) => {
        setFavoriteList(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // 문서 클릭 시 호출 이벤트
  const handleOpenEform = (index: number) => {
    // 접수번호, 동의서서식코드, 환자번호, 입외구분(입원I|O외래), 입력자사번
    // RECEPT_NO, FORM_CD, PTNT_NO, IO_GB,ENT_EMPL_NO
    const userNo = user?.match(/\d+/g).join('')
    const formInfo: { FORM_CD: Number; FORM_NM: string } = favoriteList[index]
    const iOrO = pat.division === '외래' ? 'O' : 'I'
    const data = { formInfo: formInfo.FORM_NM }
    const sendForm = encodeURI(
      `http://210.107.85.110:8080/ClipReport5/eform2.jsp?FILE_NAME=${formInfo.FORM_NM}&RECEPT_NO=${pat.receptNo}&FORM_CD=${formInfo.FORM_CD}&PTNT_NO=${pat.number}&IO_GB=${iOrO}&ENT_EMPL_NO=${userNo}`
    )
    router.push({
      pathname: 'http://210.107.85.110:8080/ClipReport5/eform2.jsp',
      query: data
    })

    router.push(sendForm)
  }

  const completeEform = () => {
    axios
      .post('/api/givenList', {
        PTNT_NO: pat.number
      })
      .then((response) => {
        setGivenList(response.data.data)

        // components.openConfirmDialog({
        //   //imageUrl: `http://localhost/images/${response.data.data.FILE_NM}.jpg`,
        //   imageUrl:
        //     'https://img.freepik.com/premium-vector/cute-background-girly-wallpaper_608030-24.jpg',
        //   contents: '',
        //   ok: {
        //     label: '닫기'
        //   }
        // })
      })
      .catch((error) => {
        console.log(error)
      })
    return components.openConfirmDialog({
      className: 'DialogDocument',
      imageUrl: 'http://210.107.85.113/images/20230823141754_8117_0.jpg',
      ok: {
        label: '닫기'
      }
    })
  }

  // 목록 버튼 클릭 이벤트
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
                        <T className="Title" onClick={() => completeEform()}>
                          {index.FORM_NM}
                        </T>
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
                  {favoriteList &&
                    favoriteList.map((index: any, i) => (
                      <ListItem key={i}>
                        <T className="Title" onClick={() => handleOpenEform(i)}>
                          {index.FORM_NM}
                        </T>
                      </ListItem>
                    ))}
                </List>
              </DocumentListContainer>
            </DocumentListTabPanel>
            <DocumentListTabPanel value={tabR} index={1}>
              <DocumentListContainer>
                <Box className="AllList">
                  {list &&
                    list.map((index: any, i) => (
                      <Accordion
                        key={i}
                        expanded={accordionNo === index}
                        onChange={accordionChange(index)}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <T className="Title">{index.CATEGORY_NAME}</T>
                        </AccordionSummary>
                        <AccordionDetails>
                          {list &&
                            list.map((index: any, i) => (
                              <ListItem key={i}>
                                <T
                                  className="Content"
                                  onClick={() => handleOpenEform(i)}
                                >
                                  {index.FORM_NM}
                                </T>
                              </ListItem>
                            ))}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                </Box>
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

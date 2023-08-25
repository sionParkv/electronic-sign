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
  const [pat, setPat] = useState<Patient>(initialPatient)
  const [tempList, setTempList] = useState([])
  const [givenList, setGivenList] = useState([])
  const [list, setList] = useState([])
  const lists = Object.keys(list)
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
    console.log(patInfoList)
    await axios
      .post('/api/tempList', {
        PTNT_NO: patInfoList.number
      })
      .then((response) => {
        setTempList(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })

    await axios
      .post('/api/givenList', {
        PTNT_NO: patInfoList.number
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
        const data = response?.data?.data
        const newList = data.reduce((acc: any, item: any) => {
          const categoryName = item.CATEGORY_NAME
          if (!acc[categoryName]) {
            acc[categoryName] = []
          }
          acc[categoryName].push(item)
          return acc
        }, {})
        setList(newList)
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

  // 문서 클릭 이벤트
  const handleOpenOneDocument = (li: { FORM_CD: number; FORM_NM: string }) => {
    const userNo = user?.match(/\d+/g)?.join('')
    const formInfo: { FORM_CD: number; FORM_NM: string } = li
    const CLIP_SOFT_URL = 'http://210.107.85.110:8080/ClipReport5/eform2.jsp'
    const { FORM_NM, FORM_CD } = formInfo
    patInfoList = JSON.parse(localStorage.getItem('sendToPatientInfo')!)
    const iOrO = pat.division === '외래' ? 'O' : 'I'
    const queryParams = new URLSearchParams({
      //공통
      FILE_NAME: FORM_NM ?? '',
      RECEPT_NO: patInfoList?.RECEPT_NO ?? '',
      FORM_CD: FORM_CD?.toString() ?? '',
      PTNT_NO: patInfoList?.PTNT_NO ?? '',
      IO_GB: iOrO,
      ENT_EMPL_NO: userNo ?? '',

      //입원
      ADM_YMD: patInfoList?.ADM_YMD ?? '',
      BIRTH_YMD: patInfoList?.BIRTH_YMD ?? '',
      DEPT_CD: patInfoList?.DEPT_CD ?? '',
      DEPT_NM: patInfoList?.DEPT_NM ?? '',
      DIAG_CD: patInfoList?.DIAG_CD ?? '',
      DIAG_NM: patInfoList?.DIAG_NM ?? '',
      DOCT_EMPL_NM: patInfoList?.DOCT_EMPL_NM ?? '',
      DOCT_EMPL_NO: patInfoList?.DOCT_EMPL_NO ?? '',
      PTNT_GB: patInfoList?.PTNT_GB ?? '',
      PTNT_NM_NICK: patInfoList?.PTNT_NM_NICK ?? '',
      PTNT_NM: patInfoList?.PTNT_NM ?? '',
      ROOM_CD: patInfoList?.ROOM_CD ?? '',
      SEX_AGE: patInfoList?.SEX_AGE ?? '',
      WARD_CD: patInfoList?.WARD_CD ?? '',

      //외래
      CLINIC_TIME: patInfoList?.CLINIC_TIME ?? '',
      CLINIC_YMD: patInfoList?.CLINIC_YMD ?? '',

      // 수술
      ABO_RH: patInfoList?.ABO_RH ?? '',
      ADDR: patInfoList?.ADDR ?? '',
      AGE: patInfoList?.AGE ?? '',
      AN_TYPE_GB_NM: patInfoList?.AN_TYPE_GB_NM ?? '',
      AN_TYPE_GB: patInfoList?.AN_TYPE_GB ?? '',
      BIRTHDAY_YMD: patInfoList?.BIRTHDAY_YMD ?? '',
      CLN_DATE: patInfoList?.CLN_DATE ?? '',
      CLN_DEPT_CD: patInfoList?.CLN_DEPT_CD ?? '',
      CLN_DEPT_NM: patInfoList?.CLN_DEPT_NM ?? '',
      OP_DEPT_CD: patInfoList?.OP_DEPT_CD ?? '',
      OP_DEPT_NM: patInfoList?.OP_DEPT_NM ?? '',
      OP_DOCT_NM: patInfoList?.OP_DOCT_NM ?? '',
      OP_DOCT_NO: patInfoList?.OP_DOCT_NO ?? '',
      OP_GB_NM: patInfoList?.OP_GB_NM ?? '',
      OP_GB: patInfoList?.OP_GB ?? '',
      OP_ROOM_CD: patInfoList?.OP_ROOM_CD ?? '',
      OP_YMD: patInfoList?.OP_YMD ?? '',
      ORD_YMD: patInfoList?.ORD_YMD ?? '',
      PATSECT: patInfoList?.PATSECT ?? '',
      PHONE_NO: patInfoList?.PHONE_NO ?? '',
      PRE_OP_NM: patInfoList?.PRE_OP_NM ?? '',
      SEX: patInfoList?.SEX ?? ''
    })
    const queryStr = queryParams.toString()
    const sendForm = `${CLIP_SOFT_URL}?${queryStr}`
    console.log(sendForm)
    router.push(sendForm)
  }

  // const handleOpenOneDocument = (li: { FORM_CD: number; FORM_NM: string }) => {
  //   // 접수번호, 동의서서식코드, 환자번호, 입외구분(입원I|O외래), 입력자사번
  //   // RECEPT_NO, FORM_CD, PTNT_NO, IO_GB,ENT_EMPL_NO
  //   const userNo = user?.match(/\d+/g).join('')
  //   const formInfo: { FORM_CD: Number; FORM_NM: string } = li
  //   const iOrO = pat.division === '외래' ? 'O' : 'I'
  //   const sendForm = encodeURI(
  //     `http://210.107.85.110:8080/ClipReport5/eform2.jsp?FILE_NAME=${formInfo.FORM_NM}&RECEPT_NO=${pat.receptNo}&FORM_CD=${formInfo.FORM_CD}&PTNT_NO=${pat.number}&IO_GB=${iOrO}&ENT_EMPL_NO=${userNo}`
  //   )
  //   router.push(sendForm)
  // }

  // 작성완료 문서 클릭 이벤트
  const completeEform = (item: any) => {
    console.log(item)
    axios
      .post('/api/givenList', {
        PTNT_NO: pat.number
      })
      .then((response) => {
        setGivenList(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
    const imageUrl =
      'http://210.107.85.113/images/' +
      item.FILE_NM +
      '_' +
      item.MAX_SEQ +
      item.FILE_TYPE
    console.log(imageUrl)

    return components.openConfirmDialog({
      className: 'DialogDocument',
      imageUrl,
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
                    tempList.map((item: any, i) => (
                      <ListItem
                        key={i}
                        onClick={() => handleOpenOneDocument(item)}
                      >
                        <T className="Title">{item.FORM_NM}</T>
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
                    givenList.map((item: any, i) => (
                      <ListItem key={i}>
                        <T
                          className="Title"
                          onClick={() => completeEform(item)}
                        >
                          {item.FORM_NM}
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
                    favoriteList.map((item: any, i) => (
                      <ListItem key={i}>
                        <T
                          className="Title"
                          onClick={() => handleOpenOneDocument(item)}
                        >
                          {item.FORM_NM}
                        </T>
                      </ListItem>
                    ))}
                </List>
              </DocumentListContainer>
            </DocumentListTabPanel>
            <DocumentListTabPanel value={tabR} index={1}>
              <DocumentListContainer>
                {lists &&
                  lists.map((item: any, idx: number) => {
                    const details: [] = list[item]
                    return (
                      <Box className="AllList" key={idx}>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <T>{item}</T>
                          </AccordionSummary>
                          <AccordionDetails>
                            {details.map((li: any, index: number) => (
                              <ListItem
                                key={index}
                                onClick={() => handleOpenOneDocument(li)}
                              >
                                <T>{li.FORM_NM}</T>
                              </ListItem>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    )
                  })}
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

/**
 * //입원
      // RECEPT_NO: RECEPT_NO ?? '',
      ADM_YMD: ADM_YMD ?? '',
      BIRTH_YMD: BIRTH_YMD ?? '',
      DEPT_CD: DEPT_CD ?? '',
      DEPT_NM: DEPT_NM ?? '',
      DIAG_CD: DIAG_CD ?? '',
      DIAG_NM: DIAG_NM ?? '',
      DOCT_EMPL_NM: DOCT_EMPL_NM ?? '',
      DOCT_EMPL_NO: DOCT_EMPL_NO ?? '',
      // IO_GB: IO_GB ?? '',
      PTNT_GB: PTNT_GB ?? '',
      PTNT_NM_NICK: PTNT_NM_NICK ?? '',
      PTNT_NM: PTNT_NM ?? '',
      // PTNT_NO: PTNT_NO ?? '',
      ROOM_CD: ROOM_CD ?? '',
      SEX_AGE: SEX_AGE ?? '',
      WARD_CD: WARD_CD ?? '',

      //외래
      // BIRTH_YMD,
      CLINIC_TIME: CLINIC_TIME ?? '',
      CLINIC_YMD: CLINIC_YMD ?? '',
      // DEPT_CD,
      // DEPT_NM,
      // DIAG_CD,
      // DIAG_NM,
      // DOCT_EMPL_NM,
      // DOCT_EMPL_NO,
      // IO_GB,
      // PTNT_NM,
      // PTNT_NM_NICK,
      // PTNT_NO,
      // RECEPT_NO,
      // SEX_AGE,

      // 수술
      ABO_RH: ABO_RH ?? '',
      ADDR: ADDR ?? '',
      AGE: AGE ?? '',
      AN_TYPE_GB: AN_TYPE_GB ?? '',
      AN_TYPE_GB_NM: AN_TYPE_GB_NM ?? '',
      BIRTHDAY_YMD: BIRTHDAY_YMD ?? '',
      CLN_DATE: CLN_DATE ?? '',
      CLN_DEPT_CD: CLN_DEPT_CD ?? '',
      CLN_DEPT_NM: CLN_DEPT_NM ?? '',
      // DIAG_NM,
      // IO_GB,
      OP_DEPT_CD: OP_DEPT_CD ?? '',
      OP_DEPT_NM: OP_DEPT_NM ?? '',
      OP_DOCT_NM: OP_DOCT_NM ?? '',
      OP_DOCT_NO: OP_DOCT_NO ?? '',
      OP_GB: OP_GB ?? '',
      OP_GB_NM: OP_GB_NM ?? '',
      OP_ROOM_CD: OP_ROOM_CD ?? '',
      OP_YMD: OP_YMD ?? '',
      ORD_YMD: ORD_YMD ?? '',
      PATSECT: PATSECT ?? '',
      PHONE_NO: PHONE_NO ?? '',
      PRE_OP_NM: PRE_OP_NM ?? '',
      // PTNT_NM,
      // PTNT_NO,
      // RECEPT_NO,
      // ROOM_CD,
      SEX: SEX ?? ''
      // WARD_CD,
 */

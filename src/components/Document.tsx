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
import React, { useEffect, useRef, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import images from '@/assets/images'
import axios from 'axios'
import { useRouter } from 'next/router'
import { getCookie, hasCookie } from 'cookies-next'
import { AES256 } from '@/utils/AES256'
import components from '@/components'
import { SocketClient } from '@/utils/SocketClient'

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
  const formRef = useRef<HTMLFormElement | null>(null) // useRef로 form 엘리먼트에 대한 참조 생성
  const CLIP_SOFT_URL2 = 'http://210.107.85.110:8080/ClipReport5/eform2.jsp'
  const CLIP_SOFT_URL4 = 'http://210.107.85.110:8080/ClipReport5/eform4.jsp'
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

  const openErrorDialog = () => {
    components.openConfirmDialog({
      className: 'custom-max-width',
      contents: (
        <>
          통신 오류가 발생했습니다. <br />
          잠시 후 다시 시도해주세요.
        </>
      ),
      ok: {
        label: '닫기',
        action: () => {
          setTimeout(() => {}, 50)
        }
      },
      title: '통신 오류'
    })
    return
  }

  // 문서 api 호출
  const loadItems = async () => {
    await axios
      .post('/api/tempList', {
        PTNT_NO: patInfoList.number
      })
      .then((response) => {
        setTempList(response.data.data)
      })
      .catch(() => {
        openErrorDialog()
      })

    await axios
      .post('/api/givenList', {
        PTNT_NO: patInfoList.number
      })
      .then((response) => {
        setGivenList(response.data.data)
      })
      .catch(() => {
        openErrorDialog()
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
      .catch(() => {
        openErrorDialog()
      })

    await axios
      .post('/api/favoriteList', {
        EMPL_NO: tempObject[0]?.EMPL_NO
      })
      .then((response) => {
        setFavoriteList(response?.data?.data)
      })
      .catch(() => {
        openErrorDialog()
      })
  }

  // 문서 클릭 이벤트
  const handleOpenOneDocument = async (
    li: {
      FILE_NM: string
      FORM_CD: number
      RECEPT_NO: number
      FORM_NM: string
    },
    code: string
  ) => {
    const userNo = user?.match(/\d+/g)?.join('')
    const formInfo: {
      FILE_NM: string
      FORM_CD: number
      RECEPT_NO: number
      FORM_NM: string
    } = li

    const { FILE_NM, FORM_CD, RECEPT_NO, FORM_NM } = formInfo
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
    const sendForm = `${CLIP_SOFT_URL2}?${queryStr}`

    if (code === 'temp') {
      SocketClient.sendSocketMessage(
        'openTempDocument',
        tempObject[0].EMPL_NO,
        `[{ "FILE_NM": "${FILE_NM}", "FORM_CD": "${FORM_CD}", "RECEPT_NO": "${RECEPT_NO}", "iOrO": "${iOrO}", "FORM_NM": "${FORM_NM}", "EMPL_NO": "${
          tempObject[0].EMPL_NO
        }", "DATA": ${JSON.stringify(patInfoList)}}]`
      )
      await axios
        .post('/api/tempData', {
          FILE_NM: FILE_NM,
          FORM_CD: FORM_CD,
          RECEPT_NO: RECEPT_NO
        })
        .then((result) => {
          const tempFormData = [
            { name: 'EFORM_DATA', value: result.data.data[0].EFORM_DATA },
            { name: 'FILE_NAME', value: FORM_NM ?? '' },
            { name: 'RECEPT_NO', value: patInfoList?.RECEPT_NO ?? '' },
            { name: 'FORM_CD', value: FORM_CD?.toString() ?? '' },
            { name: 'PTNT_NO', value: patInfoList?.PTNT_NO ?? '' },
            { name: 'IO_GB', value: iOrO },
            { name: 'ENT_EMPL_NO', value: userNo ?? '' },
            { name: 'ADM_YMD', value: patInfoList?.ADM_YMD ?? '' },
            { name: 'BIRTH_YMD', value: patInfoList?.BIRTH_YMD ?? '' },
            { name: 'DEPT_CD', value: patInfoList?.DEPT_CD ?? '' },
            { name: 'DEPT_NM', value: patInfoList?.DEPT_NM ?? '' },
            { name: 'DIAG_CD', value: patInfoList?.DIAG_CD ?? '' },
            { name: 'DIAG_NM', value: patInfoList?.DIAG_NM ?? '' },
            { name: 'DOCT_EMPL_NM', value: patInfoList?.DOCT_EMPL_NM ?? '' },
            { name: 'DOCT_EMPL_NO', value: patInfoList?.DOCT_EMPL_NO ?? '' },
            { name: 'PTNT_GB', value: patInfoList?.PTNT_GB ?? '' },
            { name: 'PTNT_NM_NICK', value: patInfoList?.PTNT_NM_NICK ?? '' },
            { name: 'PTNT_NM', value: patInfoList?.PTNT_NM ?? '' },
            { name: 'ROOM_CD', value: patInfoList?.ROOM_CD ?? '' },
            { name: 'SEX_AGE', value: patInfoList?.SEX_AGE ?? '' },
            { name: 'WARD_CD', value: patInfoList?.WARD_CD ?? '' },
            { name: 'CLINIC_TIME', value: patInfoList?.CLINIC_TIME ?? '' },
            { name: 'CLINIC_YMD', value: patInfoList?.CLINIC_YMD ?? '' },
            { name: 'ABO_RH', value: patInfoList?.ABO_RH ?? '' },
            { name: 'ADDR', value: patInfoList?.ADDR ?? '' },
            { name: 'AGE', value: patInfoList?.AGE ?? '' },
            { name: 'AN_TYPE_GB_NM', value: patInfoList?.AN_TYPE_GB_NM ?? '' },
            { name: 'AN_TYPE_GB', value: patInfoList?.AN_TYPE_GB ?? '' },
            { name: 'BIRTHDAY_YMD', value: patInfoList?.BIRTHDAY_YMD ?? '' },
            { name: 'CLN_DATE', value: patInfoList?.CLN_DATE ?? '' },
            { name: 'CLN_DEPT_CD', value: patInfoList?.CLN_DEPT_CD ?? '' },
            { name: 'CLN_DEPT_NM', value: patInfoList?.CLN_DEPT_NM ?? '' },
            { name: 'OP_DEPT_CD', value: patInfoList?.OP_DEPT_CD ?? '' },
            { name: 'OP_DEPT_NM', value: patInfoList?.OP_DEPT_NM ?? '' },
            { name: 'OP_DOCT_NM', value: patInfoList?.OP_DOCT_NM ?? '' },
            { name: 'OP_DOCT_NO', value: patInfoList?.OP_DOCT_NO ?? '' },
            { name: 'OP_GB_NM', value: patInfoList?.OP_GB_NM ?? '' },
            { name: 'OP_GB', value: patInfoList?.OP_GB ?? '' },
            { name: 'OP_ROOM_CD', value: patInfoList?.OP_ROOM_CD ?? '' },
            { name: 'OP_YMD', value: patInfoList?.OP_YMD ?? '' },
            { name: 'ORD_YMD', value: patInfoList?.ORD_YMD ?? '' },
            { name: 'PATSECT', value: patInfoList?.PATSECT ?? '' },
            { name: 'PHONE_NO', value: patInfoList?.PHONE_NO ?? '' },
            { name: 'PRE_OP_NM', value: patInfoList?.PRE_OP_NM ?? '' },
            { name: 'SEX', value: patInfoList?.SEX ?? '' }
          ]
          for (let index = 0; index < tempFormData.length; index++) {
            let eformDataInput = document.createElement('input')
            eformDataInput.type = 'hidden'
            eformDataInput.name = tempFormData[index].name
            eformDataInput.value = encodeURIComponent(tempFormData[index].value)
            formRef.current?.appendChild(eformDataInput)
          }
          // 여기서 formRef.current를 사용하여 form 엘리먼트에 접근
          if (formRef.current) {
            formRef.current.submit() // 예시로 submit을 호출하도록 설정
          }
        })
      //catch
    } else {
      SocketClient.sendSocketMessage(
        'openDocument',
        tempObject[0].EMPL_NO,
        sendForm
      )
      router.push(sendForm)
    }
  }

  // 작성완료 문서 클릭 이벤트
  const completeEform = (item: any) => {
    const imageURLs = []

    for (let index = 0; index < item.MAX_SEQ; index++) {
      const url =
        'http://210.107.85.113/images/' +
        item.FILE_NM +
        '_' +
        index +
        item.FILE_TYPE
      imageURLs.push(url)
    }

    return components.openConfirmDialog({
      className: 'DialogDocument',
      carousel: imageURLs,
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
                        onClick={() => handleOpenOneDocument(item, 'temp')}
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
                          onClick={() =>
                            handleOpenOneDocument(item, 'favorite')
                          }
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
                                onClick={() => handleOpenOneDocument(li, 'all')}
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
      <form
        ref={formRef}
        method="post"
        action={CLIP_SOFT_URL4}
        acceptCharset="euc-kr"
      >
        {/* form 내용 */}
      </form>
    </Container>
  )
}
export default Document

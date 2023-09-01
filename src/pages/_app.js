import { useEffect, useRef } from 'react'
import '../assets/styles/common.scss'
import { getCookie, hasCookie } from 'cookies-next'
import axios from 'axios'

import { StateProvider } from '@/context/stateContext'
import { useRouter } from 'next/router'
import { AES256 } from '@/utils/AES256'
import components from '@/components'
import { SocketClient } from '@/utils/SocketClient'

//Qr코드 버튼 누를 떄 실행할 버튼
export const startScanner = () => {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) // 안드로이드 아이폰을 검사해 체크
  if (isMobile) {
    window.Android.startQRScanner()
  } else {
    components.openConfirmDialog({
      contents: '이 기능은 모바일 기기에서만 가능합니다',
      ok: {
        label: '닫기',
        action: () => {
          setTimeout(() => {
            document.getElementsByTagName('input')[0].focus()
          }, 50)
        }
      },
      title: 'QR 바코드'
    })
    return
  }
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  let cookie = getCookie('loginCookie')
  const CLIP_SOFT_URL4 = 'http://210.107.85.110:8080/ClipReport5/eform4.jsp'
  let formRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      historyBack()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // formRef = (useRef < HTMLFormElement) | (null > null)
    }
  }, [router.asPath])

  useEffect(() => {
    let tempCookie = ''
    let loginCookie = []
    if (hasCookie('loginCookie')) {
      tempCookie = AES256.AES_decrypt(cookie)
      loginCookie = JSON.parse(tempCookie)
      SocketClient.connectSocket(loginCookie[0].EMPL_NO)
    } else {
      SocketClient.closeSocket()
      console.log('LOGOUT')
    }
  }, [cookie])

  /**
   * 안드로이드 디바이스의 백키를 히스토리 뒤로가기 기능으로 사용하기 위해 사용할 함수.
   *  @returns {Number} 앱을 종료할 것인지 여부(0: 종료하지 않음 | 1: 종료함).
   */
  const historyBack = () => {
    const currentURL = location.href
    let isExit = 0
    window.historyBack = () => {
      if (!currentURL.includes('patient')) {
        isExit = 1
      } else {
        history.back()
      }
      return isExit
    }
  }

  SocketClient.socket.on('message', (message) => {
    console.log(message)
  })
  SocketClient.socket.on('openDocument', (URL) => {
    console.log(URL)
    router.push(URL, { replace: false })
  })
  SocketClient.socket.on('openTempDocument', (data) => {
    console.log('임시문서 열람 ' + data)
    const dataObject = JSON.parse(data)
    console.log(dataObject)
    const patInfoList = dataObject[0].DATA
    axios
      .post('/api/tempData', {
        FILE_NM: dataObject[0].FILE_NM,
        FORM_CD: dataObject[0].FORM_CD,
        RECEPT_NO: dataObject[0].RECEPT_NO
      })
      .then((result) => {
        const tempFormData = [
          { name: 'EFORM_DATA', value: result.data.data[0].EFORM_DATA },
          { name: 'FILE_NAME', value: dataObject[0].FORM_NM ?? '' },
          { name: 'RECEPT_NO', value: patInfoList?.RECEPT_NO ?? '' },
          { name: 'FORM_CD', value: dataObject[0].FORM_CD?.toString() ?? '' },
          { name: 'PTNT_NO', value: patInfoList?.PTNT_NO ?? '' },
          { name: 'IO_GB', value: dataObject[0].iOrO },
          { name: 'ENT_EMPL_NO', value: dataObject[0].EMPL_NO ?? '' },
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
          console.log(formRef + '있음')
          formRef.current.submit() // 예시로 submit을 호출하도록 설정
        } else {
          console.log(formRef + '없음')
        }
      })
  })

  return (
    <StateProvider>
      <Component {...pageProps} />
      <form
        ref={formRef}
        method="post"
        action={CLIP_SOFT_URL4}
        acceptCharset="euc-kr"
      >
        {/* form 내용 */}
      </form>
    </StateProvider>
  )
}

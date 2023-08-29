import { useEffect } from 'react'
import '../assets/styles/common.scss'

import { StateProvider } from '@/context/stateContext'
import { useRouter } from 'next/router'

//Qr코드 버튼 누를 떄 실행할 버튼
export const startScanner = () => {
  window.Android.startQRScanner()
}

// export const onQRCodeScanned = (data) => {
//   //Qr스캔 후 환자번호를 가져올 거
//   return data
// }

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      historyBack()
      onQRCodeScanned()
    }
  }, [router.asPath])

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
  const onQRCodeScanned = (data) => {
    //Qr스캔 후 환자번호를 가져올 거
    return data
  }

  return (
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  )
}

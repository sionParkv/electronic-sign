import '../assets/styles/common.scss'

import { StateProvider } from '@/context/stateContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  )
}

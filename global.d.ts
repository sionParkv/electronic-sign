/* eslint-disable no-unused-vars */

export {}

declare global {
  interface Window {
    onQRCodeScanned: (data: any) => void
  }
}

/* eslint-disable @next/next/no-img-element */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

/**
 * 확인 대화상자를 제공하는 컴포넌트.
 *
 * @param {React.ComponentProps} props 컴포넌트에 전달된 속성 겍채.
 * @param {Object} props.cancel 취소 버튼 속성.
 * @param {Function} props.cancel.action 취소 버튼 액션.
 * @param {String} [props.cancel.label='취소'] 취소 버튼 라벨.
 * @param {String} [props.className] 확인 대화상자에 적용할 스타일시트 클래스명.
 * @param {React.Component|String} [props.contents] 확인 대화상자 내용.
 * @param {Object} props.ok 확인 버튼 속성.
 * @param {Function} props.ok.action 확인 버튼 액션.
 * @param {String} [props.ok.label='확인'] 확인 버튼 라벨.
 * @param {String} [props.title] 확인 대화상자 제목.
 * @returns {React.Component} 확인 대화상자 컴포넌트.
 */
const ConfirmDialog = (props: any) => {
  const { cancel, className, contents, ok, title, imageUrl } = props
  const [open, setOpen] = useState(true)
  const clsConfirmDialog = 'ConfirmDialog ' + className

  // 기본 버튼 라벨
  if (cancel && !cancel.label) cancel.label = '취소'
  if (ok && !ok.label) ok.label = '확인'

  /**
   * 확인용 대화상자 닫기.
   */
  const close = () => {
    setOpen(false)
    setTimeout(closeConfirmDialog, 100)
  }

  /**
   * 취소 버튼 클릭시 실행할 핸들러.
   *
   * @param {React.SyntheticEvent} event 이벤트.
   */
  const handleCancel = (event: any) => {
    if (cancel && typeof cancel.action === 'function') cancel.action(event)
    close()
  }

  /**
   * 확인 버튼 클릭시 실행할 핸들러.
   *
   * @param {React.SyntheticEvent} event 이벤트.
   */
  const handleOK = (event: any) => {
    if (ok && typeof ok.action === 'function') ok.action(event)
    close()
  }

  console.log(
    'https://img.freepik.com/premium-vector/cute-background-girly-wallpaper_608030-24.jpg'
  )

  return (
    <Dialog
      className={clsConfirmDialog}
      disableEscapeKeyDown
      maxWidth="md"
      open={open}
    >
      {title && (
        <DialogTitle className="ConfirmDialogTitle">{title}</DialogTitle>
      )}
      {contents && (
        <DialogContent className="ConfirmDialogContents">
          {contents}
        </DialogContent>
      )}
      {imageUrl && (
        <DialogContent className="ConfirmDialogContents">
          <img src={imageUrl} alt="Img" />
        </DialogContent>
      )}
      <DialogActions className="ConfirmDialogButtons">
        {cancel && (
          <Button className="ButtonCancel" fullWidth onClick={handleCancel}>
            {cancel.label}
          </Button>
        )}
        {ok && (
          <Button
            className="ButtonOK"
            fullWidth
            onClick={handleOK}
            variant="outlined"
          >
            {ok.label}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

const className = 'ConfirmDialogContainer'
let depth = 0
let rootsForConfirmDialog: any = []

/**
 * 확인 대화상자 닫기.
 */
const closeConfirmDialog = () => {
  if (depth > 1) {
    setTimeout(closeConfirmDialog, 500)
    return
  }

  let ele = document.querySelector(`.${className}${depth - 1}`)
  if (ele) {
    let root = rootsForConfirmDialog[depth - 1]
    root && root.unmount()
    root = null
    rootsForConfirmDialog.pop()
    depth--
    ele.parentNode?.removeChild(ele)
  }
}

/**
 * 확인 대화상자 열기.
 *
 * @param {React.ComponentProps} props 컴포넌트에 전달된 속성 겍채.
 * @param {Object} props.cancel 취소 버튼 속성.
 * @param {Function} props.cancel.action 취소 버튼 액션.
 * @param {String} [props.cancel.label='취소'] 취소 버튼 라벨.
 * @param {String} [props.className] 확인 대화상자에 적용할 스타일시트 클래스명.
 * @param {React.Component|String} [props.contents] 확인 대화상자 내용.
 * @param {Object} props.ok 확인 버튼 속성.
 * @param {Function} props.ok.action 확인 버튼 액션.
 * @param {String} [props.ok.label='확인'] 확인 버튼 라벨.
 * @param {String} [props.title] 확인 대화상자 제목.
 */
const openConfirmDialog = (props: any) => {
  if (!props?.ok && !props?.cancel) return

  let ele = document.querySelector(`.${className}${depth}`)
  if (!ele) {
    ele = document.createElement('div')
    ele.className = `${className}${depth}`
    document.body.appendChild(ele)
  }

  const root = createRoot(ele)
  rootsForConfirmDialog.push(root)
  depth++

  root.render(<ConfirmDialog {...props} />)
}

export { closeConfirmDialog, ConfirmDialog, openConfirmDialog }

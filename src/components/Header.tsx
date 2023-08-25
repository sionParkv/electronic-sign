/**
 * 상단 Header 컴포넌트
 */

import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Button,
  Toolbar,
  Typography as T,
  Drawer,
  ListItem,
  ListItemText
} from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import IMGS from '../assets/images'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/router'

const Header = (props: { userInfo: string }) => {
  const { userInfo } = props
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Drawer 데이터
  const data = [{ name: '모바일 전자 동의서' }]

  // 로그아웃 클릭 이벤트
  const logout = () => {
    deleteCookie('loginCookie')
    router.push('/login')
    localStorage.clear()
  }

  // Drawer 컴포넌트
  const getList = () => (
    <div onClick={() => setOpen(false)} className="DrawerMenu">
      <Button startIcon={<KeyboardArrowUpIcon />}>Close</Button>
      <Image src={IMGS.WhiteLogo} alt="Logo" />
      {data.map((item, index) => (
        <ListItem key={index} onClick={mainLogo}>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </div>
  )

  // 좌측 메인로고 클릭 이벤트
  const mainLogo = () => {
    router.push('/')
  }

  return (
    <AppBar className="Header">
      <Toolbar>
        <Button className="Logo" onClick={mainLogo}>
          <Image src={IMGS.Logo} alt="Logo" />
        </Button>
        <T>{userInfo}</T>
        <Button className="Logout" onClick={logout}>
          로그아웃
        </Button>
        <Button className="Menu" onClick={() => setOpen(true)}>
          <MenuIcon />
        </Button>
        <Drawer open={open} anchor={'right'} onClose={() => setOpen(false)}>
          {getList()}
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}

export default Header

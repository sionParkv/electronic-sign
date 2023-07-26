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

  const data = [
    { name: '모바일 전자 동의서' },
    { name: 'Inbox' },
    { name: 'Outbox' }
  ]

  const logout = () => {
    deleteCookie('testCookie')
    router.push('/login')
  }

  const getList = () => (
    <div onClick={() => setOpen(false)} className="DrawerMenu">
      <Button startIcon={<KeyboardArrowUpIcon />}>Close</Button>
      <Image src={IMGS.WhiteLogo} alt="Logo" />
      {data.map((item, index) => (
        <ListItem key={index}>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </div>
  )

  return (
    <AppBar className="Header">
      <Toolbar>
        <Button className="Logo">
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

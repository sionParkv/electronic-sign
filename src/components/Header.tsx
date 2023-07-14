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

const Header = (props: { userInfo: string }) => {
  const { userInfo } = props
  const [open, setOpen] = useState(false)

  const data = [
    { name: '모바일 전자 동의서' },
    { name: 'Inbox' },
    { name: 'Outbox' }
  ]

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
        <T>{userInfo} 님</T>
        <Button className="Logout">로그아웃</Button>
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

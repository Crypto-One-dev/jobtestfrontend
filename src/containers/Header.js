import { InlineFooter } from './Footer'
import React from "react"
import styled from 'styled-components'

const HeaderContainer = styled.div`
  background: linear-gradient(316.23deg, rgba(0, 0, 0, 0.3) -12.29%, rgba(255, 255, 255, 0.3) 112.77%), #779;
  box-shadow: -15px -15px 20px rgba(250, 251, 255, 0.4), 15px 15px 30px #452e40;
  border-radius: 0px 0px 10px 10px;
  height: 70px;
`

function Header() {

  return (
    <HeaderContainer className="w-full flex flex-row items-center justify-end header-container header-padding">
      <InlineFooter />
    </HeaderContainer>
  )
}

export default Header

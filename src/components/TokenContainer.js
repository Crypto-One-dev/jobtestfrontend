import React from 'react'
import styled from 'styled-components'
import { Tokens } from '../constants/tokens'

const TokenContainers = styled.div`
  background: linear-gradient(317.7deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 105.18%), #E7EBF0;
  background-blend-mode: soft-light, normal;
  border: 0.5px solid rgba(255, 255, 255, 0.4);
  box-sizing: border-box;
  border-radius: 50px;

  display: flex;
  align-items: center;
`

function TokenContainer({ tokenKey }) {
  const token = Tokens[tokenKey]
  return (
    <TokenContainers
      className="px-2 py-1 cursor-pointer box-shadow"
    >
      <img src={token.logo} className="box-shadow rounded-full" alt="" width={20} height={20} />
      <span className="mx-1">{token.symbol}</span>
    </TokenContainers>
  )
}

export default TokenContainer

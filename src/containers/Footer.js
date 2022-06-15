import React, { useEffect, useState } from "react"
import { formatBalance, getBalance, isRightNetwork } from '../utils/web3'
import { injected, walletconnect } from '../constants/web3'
import { useWalletModalToggle, useWrongNetworkModalToggle } from '../state/application/hooks'

import { AiOutlineExclamationCircle } from 'react-icons/ai'
import Button from '../components/Button'
import MetamaskIcon from '../assets/wallet/metamask.png'
import TrustWalletIcon from '../assets/wallet/trustWallet.png'
import WalletConnectIcon from '../assets/wallet/walletConnectIcon.svg'
import styled from "styled-components"
import { toFloat } from '../utils/number'
import { useWeb3React } from "@web3-react/core"
import { Tokens } from '../constants/tokens'

const FooterContainer = styled.div`
  &.mobile-show {
    @media (max-width: 960px) {
      display: flex;
      margin-right: 5px;
    }
  }
  &.mobile-hide {
    display: flex;
  }
`
const FooterBg = styled.div`
    background: linear-gradient(316.23deg, rgba(0, 0, 0, 0.3) -12.29%, rgba(255, 255, 255, 0.3) 112.77%), #4E555D;
    background-blend-mode: soft-light, normal;
    box-shadow: -5px -5px 30px #35373E;
    border-radius: 10px 10px 0px 0px;
}
`

export function InlineFooter({additionalClass, extra}) {

  const { chainId, library, account, connector } = useWeb3React()
  
  const [balance, setBalance] = useState(0)
  useEffect(() => {
    async function fetchBalance() {
      try {
        if(library && account && isRightNetwork(chainId)) {
          let newBalance = await getBalance(account, Tokens['TT'].address , library)
          newBalance = formatBalance(newBalance)
          setBalance(Math.trunc(toFloat(newBalance) * 100) / 100)
        }
      } catch(e) { console.log(e) }
    }
    let interval = -1
    const proc = () => {
      fetchBalance()
    }
    proc()
    interval = setInterval(proc, 1000)

    return () => {
      if(interval > -1) {
        clearInterval(interval)
      }
    }
  }, [account, chainId, library])
  const toggleWalletModal = useWalletModalToggle()
  const toggleWrongNetworkModal = useWrongNetworkModalToggle()

  return (
    <FooterContainer
      style={{zIndex: 1}}
      className={`
        ${additionalClass}
        ${extra ? 'mobile-show' : 'mobile-hide'}
        flex flex-row items-center justify-between p-3 sticky top-0 z-10
      `}>
      {
        account ?
          isRightNetwork(chainId) ?
            <div
              className="rounded-3xl pl-3 pr-2 py-1 text-sm text-white flex items-center justify-center bg-gray-500 cursor-pointer number-font"
              style={{
                background: 'linear-gradient(313.34deg, rgba(0, 0, 0, 0.3) -28.92%, rgba(255, 255, 255, 0.3) 130.82%), #171416',
                boxShadow: '-5px -5px 10px rgb(250 251 255 / 10%), 5px 5px 10px #171416',
                borderRadius: '8px',
                backgroundBlendMode: 'soft-light, normal'
              }}
            onClick={toggleWalletModal}

            >
              {balance} TT
              <div
                className="rounded-3xl px-3 py-1 ml-3 flex items-center justify-center bg-gray-800"
                style={{
                  background: 'linear-gradient(132.13deg, rgba(0, 0, 0, 0.4) -7.08%, rgba(255, 255, 255, 0.4) 123.64%), #262124',
                  boxShadow: 'inset -5px -5px 10px rgba(250, 251, 255, 0.1), inset 5px 5px 10px #262124',
                  borderRadius: '8px',
                  backgroundBlendMode: 'soft-light, normal'
                }}
              >
                {account.substr(0, 6) + '...' + account.substr(-4)}
                <img src={
                  connector === walletconnect ? WalletConnectIcon :
                  connector === injected && window.ethereum && window.ethereum.isMetaMask ? MetamaskIcon :
                  connector === injected && window.ethereum && window.ethereum.isTrust ? TrustWalletIcon :
                  null
                } width={18} height={18} alt="" className="ml-2" />
              </div>
            </div>
          :
            <Button
              className="test-red"
              width="170px"
              height="40px"
              onClick={toggleWrongNetworkModal}
            >
              <AiOutlineExclamationCircle className="mr-1" />
              Wrong Network
            </Button>
        :
          <Button
            className="test-pink"
            width="170px"
            height="40px"
            onClick={toggleWalletModal}
          >
            Connect Wallet
          </Button>

      }
    </FooterContainer>
  )
}

export function Footer() {
  return (
      <FooterBg className="mobile-show bottom-0 sticky z-10">
        <InlineFooter additionalClass="w-full" extra={true} />
      </FooterBg>
  )
}

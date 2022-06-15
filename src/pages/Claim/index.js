import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import Button from '../../components/Button'
import TokenContainer from '../../components/TokenContainer'
import { useWalletModalToggle } from '../../state/application/hooks'
import { setTx } from '../../state/tx/actions'
import { formatValue, toFloat } from '../../utils/number'
import { formatBN, formatBalance, getBalance, getClaimableBalance, getContract, isRightNetwork } from '../../utils/web3'

import TESTTOKEN_ABI from '../../assets/contracts/testcontract_abi.json'
import { TEST_TOKEN } from '../../constants/contracts'
import { Tokens } from '../../constants/tokens'


const StakeContainer = styled.div`
  background: linear-gradient(311.99deg, rgba(0, 0, 0, 0.3) -22.55%, rgba(255, 255, 255, 0.3) 131.34%), #171416;
  background-blend-mode: soft-light, normal;
  border-radius: 5px;
  position: relative;
`
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #FFFFFF44;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`
const TokenArea = styled.div`
  padding: 1rem 1rem 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const TokenAmount = styled.input`
  background: transparent;
  color: white;
  text-align: right;
  width: 200px;
  font-family: 'Roboto Mono', monospace;
  &:focus {
    outline: none;
  }
`

export default function StakePage() {
  const { chainId, account, library } = useWeb3React()
  const [newClaim, setNewClaim] = useState('')
  const tokenToClaim = Tokens['TT']
  const [balance, setBalance] = useState(0)
  const [claimableBal, setClaimableBalance] = useState(0)

  const toggleWalletModal = useWalletModalToggle()
  const dispatch = useDispatch()

  const STATUS = {
    READY: 0,
    PENDING: 1
  }
  const [status, setStatus] = useState(STATUS.READY)

  const [fetchIndex, setFetchIndex] = useState(0)
  const tryFetch = () => {
    setFetchIndex(fetchIndex + 1)
  }

  useEffect(() => {

    async function fetchTokenBalance(tokenAddress, tokenDecimals, setTokenBalance) {
      try {
        let newBalance = await getBalance(account, tokenAddress, library)
        newBalance = formatBalance(newBalance, tokenDecimals)
        setTokenBalance(toFloat(newBalance))
      } catch(e) { console.log(e) }
    }

    async function fetchClaimableBalance(tokenAddress, tokenDecimals, setTokenBalance) {
      try {
        let newBalance = await getClaimableBalance(account, tokenAddress, library)
        newBalance = formatBalance(newBalance, tokenDecimals)
        setTokenBalance(toFloat(newBalance))
      } catch(e) { console.log(e) }
    }

    if(!library || !account || !isRightNetwork(chainId) || !tokenToClaim) {
      setBalance(0)
      setClaimableBalance(0)
      setNewClaim('')
      return
    }
    fetchTokenBalance(tokenToClaim.address, tokenToClaim.decimals, setBalance)
    fetchClaimableBalance(tokenToClaim.address, tokenToClaim.decimals, setClaimableBalance)
  }, [chainId, account, library, tokenToClaim, claimableBal, fetchIndex, balance, tokenToClaim.address, tokenToClaim.decimals])

  const claimToken = async () => {
    try {
      if(toFloat(newClaim) === 0) return
      setStatus(STATUS.PENDING)
      const TokenContract = getContract(TEST_TOKEN, TESTTOKEN_ABI, library, account)
      let tx = await TokenContract.claim(formatBN(newClaim, tokenToClaim.decimals))
      tx = await tx.wait(1)
      dispatch(setTx(tx.transactionHash, `${toFloat(newClaim)} ${tokenToClaim.symbol} Claimed`, true))
      setNewClaim('')
      tryFetch()
    } catch(e) {
      dispatch(setTx('', (e.data && e.data.message) || e.message, false))
    }
    setStatus(STATUS.READY)
  }

  useEffect(() => {

    async function fetchTokenBalance(tokenAddress, tokenDecimals, setTokenBalance) {
      try {
        let newBalance = await getBalance(account, tokenAddress, library)
        newBalance = formatBalance(newBalance, tokenDecimals)
        setTokenBalance(toFloat(newBalance))
      } catch(e) { console.log(e) }
    }

    let interval = -1
    const proc = () => {
      fetchTokenBalance(tokenToClaim.address, tokenToClaim.decimals, setBalance)
    }
    proc()
    interval = setInterval(proc, 1000)

    return () => {
      if(interval > -1) {
        clearInterval(interval)
      }
    }
  }, [account, library, tokenToClaim.address, tokenToClaim.decimals])

  const inputRegex = new RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
  const checkAndUpdate = (amount, callback) => {
    const nextUserInput = amount ? amount.toString().replace(/[,]/g, '') : ''
    if (!nextUserInput || inputRegex.test(nextUserInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
      if(callback)
        callback(nextUserInput.toString())
    }
  }
  
  return (
    <>
      <StakeContainer
        className="w-full max-w-2xl dark-box-shadow"
      >
        <div
          className="px-3 pt-3 text-white flex items-center justify-between"
        >
          <span>Claimable Balance</span>
          {claimableBal} TT
        </div>
        <Divider />
        <TokenArea
        >
          <TokenContainer tokenKey={'TT'} />
          <TokenAmount
            placeholder="0.0"
            disabled={ !account || !isRightNetwork(chainId) }
            onChange={ (e) => checkAndUpdate(e.target.value, setNewClaim) }
            value={ formatValue(newClaim) }
            readOnly={claimableBal <= 0}
          />
        </TokenArea>
        <div
          className="p-3 flex items-center justify-between flex-col"
        >
          {
            account && isRightNetwork(chainId) ?
              <Button
                className="w-full test-pink"
                disabled={status === STATUS.PENDING || toFloat(newClaim) <= 0}
                onClick={claimToken}
              >
                Claim
              </Button>
            :
              <Button
                className="w-full test-pink"
                disabled={status === STATUS.PENDING}
                onClick={!account ? toggleWalletModal : null}
              >
                Connect Wallet
              </Button>
            }
        </div>

      </StakeContainer>
    </>
  )
}

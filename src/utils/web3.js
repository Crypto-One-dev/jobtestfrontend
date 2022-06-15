import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { BigNumber, ethers } from 'ethers'

import ERC20_ABI from '../assets/contracts/erc20_abi.json'
import TESTTOKEN_ABI from '../assets/contracts/testcontract_abi.json'
import { SUPPORTED_CHAINIDS } from '../constants/web3'


export const isRightNetwork = (chainId) => {
  return SUPPORTED_CHAINIDS.includes(chainId)
}

export function isAddress(value) {
  try {
      return getAddress(value)
  } catch {
      return false
  }
}
export function isAddressString(value) {
  try {
      return getAddress(value)
  } catch {
      return ''
  }
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
      throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

export async function getBalance(account, token, library) {
  try {
    if(!isAddress(token)) {
      return await library.getBalance(account)
    }
    const contract = getContract(token, ERC20_ABI, library, account)
    return await contract.balanceOf(account)
  } catch(e) { console.log(e) }
  return 0
}

export async function getClaimableBalance(account, token, library) {
  try {
    if(!isAddress(token)) {
      return await library.getBalance(account)
    }
    const contract = getContract(token, TESTTOKEN_ABI, library, account)
    return await contract._cBalances(account)
  } catch(e) { console.log(e) }
  return 0
}


export const formatBalance = (value, decimals = 18, maxFraction = 0) => {
  try {
    const formatted = ethers.utils.formatUnits(value, decimals)
    if (maxFraction > 0) {
        const split = formatted.split('.')
        if (split.length > 1) {
            return split[0] + '.' + split[1].substr(0, maxFraction)
        }
    }
    return formatted
  } catch(e) { console.log(e) }
  return 0
}

export const formatBN = (value, decimals = 18) => {
  try {
    const formatted = ethers.utils.parseUnits(value.toString(), decimals)
    return formatted
  } catch(e) { console.log(e) }
  return BigNumber.from(0)
}
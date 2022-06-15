import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getContract } from '../utils/web3'

export function useContract(address, ABI, withSignerIfPossible) {
  const { library, account } = useWeb3React()

  return useMemo(() => {
      if (!address || !ABI || !library) return null
      try {
          return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
      } catch (error) {
          console.error('Failed to get contract', error)
          return null
      }
  }, [address, ABI, library, withSignerIfPossible, account])
}

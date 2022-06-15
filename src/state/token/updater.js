import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

import { resetTokenInfo, setBalance } from './actions'
import { useBlockNumber } from '../application/hooks'

import { TokenList } from '../../constants/tokens'
import { toFloat } from '../../utils/number'
import { formatBalance, getBalance, isRightNetwork } from '../../utils/web3'

export default function Updater() {
    const { library, chainId, account } = useWeb3React()
    const lastBlockNumber = useBlockNumber()
    const dispatch = useDispatch()
    
    useEffect(() => {
        const getTokenBalance = async (token, address, decimals) => {
            let newBalance = await getBalance(account, address, library)
            newBalance = toFloat(formatBalance(newBalance, decimals))
            dispatch(setBalance(token, newBalance))
        }
        const fetchBalances = async () => {
            try {
                for (const token of TokenList) {
                    getTokenBalance(token.symbol, token.address, token.decimals)
                }
            } catch(e) { console.log(e) }
        }

        if(!library || !account || !isRightNetwork(chainId)) {
            dispatch(resetTokenInfo())
            return
        }

        fetchBalances()
    }, [chainId, library, account, lastBlockNumber, dispatch])

    return null
}

import { useSelector } from 'react-redux'

export function useGetPrice(token) {
  const price = useSelector(state => state.token.prices[token])
  if(!price)
    return 0
  return price
}

export function useGetBalance(token) {
  const balance = useSelector(state => state.token.balances[token])
  if(!balance)
    return 0
  return balance
}

export function useGetAllowance(token, spender) {
  const allowances = useSelector(state => state.token.allowances)
  if(!allowances[token] || !allowances[token][spender])
    return 0
  return allowances[spender]
}
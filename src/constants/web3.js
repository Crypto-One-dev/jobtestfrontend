import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const SUPPORTED_CHAINIDS = [
  97
]

export const injected = new InjectedConnector()

export const walletconnect = new WalletConnectConnector({
  rpc: {
      97: 'https://data-seed-prebsc-1-s2.binance.org:8545'

  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})
import React from 'react'
import { Snackbar } from '@material-ui/core'
import { FaRegCheckCircle } from 'react-icons/fa'
import { Provider as ReduxProvider } from 'react-redux'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'

import './App.css'
import Header from './containers/Header'
import WalletModal from './containers/WalletModal'
import WrongNetworkModal from './containers/WrongNetworkModal'
import Routes from './containers/routes'
import configureStore from './state'
import ApplicationUpdater from './state/application/updater'
import TokenUpdater from './state/token/updater'
import { useTx, useTxToast, useCloseTxToast } from './state/tx/hooks'

function getLibrary(provider) {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 15000
  return library
}

const reduxStore = configureStore()

function Updaters() {
  return (
      <>
          <ApplicationUpdater />
          <TokenUpdater />
      </>
  )
}

function Modals() {
  const tx = useTx()
  const toast = useTxToast()
  const closeTxToast = useCloseTxToast()
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    closeTxToast()
  }
  return <>
    <WalletModal />
    <WrongNetworkModal />
    <Snackbar open={toast} autoHideDuration={5000} onClose={handleClose}>
      <div
        className={`
          w-full max-w-3xl p-3 rounded-md
          ${tx.txStatus ? 'cursor-pointer' : ''}
        `}
        style={{
          background: tx.txStatus ? "rgba(61, 199, 99, 0.3)" : "rgba(237, 61, 61, 0.3)",
          backdropFilter: "blur(5px)"
        }}
        onClick={() => {
          if(!tx.txStatus) {
            handleClose()
          } else {
            window.open('https://etherscan.io/tx/' + tx.txId)
          }
        }}
      >
        <div className="w-full flex flex-row items-center">
          <FaRegCheckCircle color={tx.txStatus ? "rgb(61, 199, 99)" : "rgb(237, 61, 61)"} size={32} className="mr-3" />
          <div className="text-white flex flex-col items-center text-left">
            <span className="w-full">Transaction #{tx.txIndex} {tx.txStatus ? 'Completed' : 'Failed'}!</span>
            <span className="w-full opacity-60" style={{fontSize: 11}}>{tx.txStatus ? 'Tap to view this transaction' : tx.txDescription}</span>
          </div>
        </div>
      </div>
    </Snackbar>
  </>
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ReduxProvider store={reduxStore}>
        <Updaters />
        <div className="App flex flex-col">
          <div className="w-full relative sticky top-0 z-10">
            <Header />
          </div>
          <div
            className="DisplayBox w-full flex-grow relative flex flex-col mx-auto items-center justify-center px-5 py-3"
          >
            <Routes />
          </div>
          <Modals />
        </div>
      </ReduxProvider>
    </Web3ReactProvider>
  )
}

export default App

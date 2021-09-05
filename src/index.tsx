import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import { AbstractConnector } from '@web3-react/abstract-connector'
// import your favorite web3 convenience library here

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLibrary(provider: any, connector: AbstractConnector | undefined): Web3 {
  console.log(connector)
  return new Web3(provider) // this will vary according to whether you use e.g. ethers or web3.js
}
ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

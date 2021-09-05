import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { injected } from '../services/connectors'
import { ConnectWallet } from './ConnectWallet'

function App(): React.ReactElement {
  const { activate } = useWeb3React()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).ethereum === undefined) {
    return <div>No wallet!</div>
  }
  const onConnectClick = (): void => {
    activate(injected)
  }
  return (
    <main>
      <h1>Planets with Loot</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Enim eu turpis egestas pretium aenean pharetra magna ac
        placerat. Non diam phasellus vestibulum lorem. Faucibus turpis in eu mi bibendum neque. Urna
        cursus eget nunc scelerisque viverra. Tempus urna et pharetra pharetra massa massa ultricies
        mi. Quis varius quam quisque id diam vel. Ligula ullamcorper malesuada proin libero. Sed
        turpis tincidunt id aliquet risus feugiat. Et tortor at risus viverra adipiscing at in
        tellus integer. Ut aliquam purus sit amet luctus.
      </p>
      <ConnectWallet onConnectClick={onConnectClick} />
    </main>
  )
}
export default App

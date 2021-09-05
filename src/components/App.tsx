import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { useEagerConnect, useInactiveListener } from '../hooks.ts/web3-react-hooks'
import { injected } from '../services/connectors'
import { mintPlanet } from '../services/contractInteraction'
import Button from './Button'
import { ConnectWallet } from './ConnectWallet'

function App(): React.ReactElement {
  const { activate, chainId, account, library } = useWeb3React()

  const onConnectClick = (): void => {
    activate(injected, console.error)
  }
  const onMintPlanetClick = async (): Promise<void> => {
    if (account) {
      await mintPlanet(account, library)
    }
  }
  const onMintPlanetWithLootClick = async (): Promise<void> => {
    console.log('pom')
  }
  console.log(chainId)

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  return (
    <main>
      <h1>Planets with Loot</h1>
      {chainId !== 1 && <div>Unsapported chain Id {chainId}. Please switch to chainId 1</div>}
      <h2>your address: {account}</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Enim eu turpis egestas pretium aenean pharetra magna ac
        placerat. Non diam phasellus vestibulum lorem. Faucibus turpis in eu mi bibendum neque. Urna
        cursus eget nunc scelerisque viverra. Tempus urna et pharetra pharetra massa massa ultricies
        mi. Quis varius quam quisque id diam vel. Ligula ullamcorper malesuada proin libero. Sed
        turpis tincidunt id aliquet risus feugiat. Et tortor at risus viverra adipiscing at in
        tellus integer. Ut aliquam purus sit amet luctus.
      </p>
      {!account && <ConnectWallet onConnectClick={onConnectClick} />}
      <Button onClick={onMintPlanetClick}>Mint planet!</Button>
      <Button onClick={onMintPlanetWithLootClick}>Mint planet with Loot!</Button>
    </main>
  )
}
export default App

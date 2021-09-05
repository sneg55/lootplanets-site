import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { useEagerConnect, useInactiveListener } from '../hooks.ts/web3-react-hooks'
import { injected } from '../services/connectors'
import { hasLootToken, mintPlanet } from '../services/contractInteraction'
import Button from './Button'
import { ConnectWallet } from './ConnectWallet'
import ErrorMessage from './ErrorMessage'

function App(): React.ReactElement {
  const { activate, chainId, account, library } = useWeb3React()
  const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (chainId !== 1) {
      setErrorMsg(`Unsapported chain Id ${chainId}. Please switch to chainId 1`)
    } else {
      errorMsg?.startsWith('Unsapported chain') && setErrorMsg(undefined)
    }
  }, [chainId])

  const onConnectClick = (): void => {
    activate(injected, console.error)
  }
  const onMintPlanetClick = async (): Promise<void> => {
    if (account) {
      await mintPlanet(account, library)
    }
  }
  const onMintPlanetWithLootClick = async (): Promise<void> => {
    if (!account) {
      setErrorMsg(`Please connect your Wallet`)
      return
    }
    const hasLootInWallet = await hasLootToken(account, library)
    if (!hasLootInWallet) {
      setErrorMsg('You should have $LOOT in your wallet to be able to call mintWithLoot')
    }
  }
  const onMainnetSwitchClick = async (): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      e.message && setErrorMsg(e.message)
    }
  }

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  return (
    <main>
      <h1>Planets with Loot</h1>
      {errorMsg && <ErrorMessage message={errorMsg} />}
      {account && <h2>You are connected as {account}</h2>}
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Enim eu turpis egestas pretium aenean pharetra magna ac
        placerat. Non diam phasellus vestibulum lorem. Faucibus turpis in eu mi bibendum neque. Urna
        cursus eget nunc scelerisque viverra. Tempus urna et pharetra pharetra massa massa ultricies
        mi. Quis varius quam quisque id diam vel. Ligula ullamcorper malesuada proin libero. Sed
        turpis tincidunt id aliquet risus feugiat. Et tortor at risus viverra adipiscing at in
        tellus integer. Ut aliquam purus sit amet luctus.
      </p>
      {chainId !== 1 && <Button onClick={onMainnetSwitchClick}>Switch to Ethereum Mainnet</Button>}
      {!account && chainId === 1 && (
        <div>
          <ConnectWallet onConnectClick={onConnectClick} />
        </div>
      )}
      {account && (
        <div>
          <Button onClick={onMintPlanetClick}>Mint planet!</Button>
          <Button onClick={onMintPlanetWithLootClick}>Mint planet with Loot!</Button>
        </div>
      )}
    </main>
  )
}
export default App

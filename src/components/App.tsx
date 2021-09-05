import { useWeb3React } from '@web3-react/core'
import React from 'react'
import PlanetsWithLoot from '../contracts/PlanetsWithLoot'
import { useEagerConnect, useInactiveListener } from '../hooks.ts/web3-react-hooks'
import { injected } from '../services/connectors'
import {
  fillArrayRange,
  getClaimedTokenIds,
  getLootTokenBalance,
  getPlanetsWithLootTokenBalance,
  hasLootToken,
  mintPlanet,
  mintWithLootPlanet,
} from '../services/contractInteraction'
import Button from './Button'
import { ConnectWallet } from './ConnectWallet'
import ErrorMessage from './ErrorMessage'

function App(): React.ReactElement {
  const { activate, chainId, account, library } = useWeb3React()
  const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined)
  const [ownedIds, setOwnedIds] = React.useState<number[] | undefined>(undefined)
  const [lootBalance, setLootBalance] = React.useState<number | undefined>(undefined)
  const [selectedTokenId, setSelectedTokenId] = React.useState<number | undefined>(undefined)
  const [planetsWithLootBalance, setPlanetsWithLootBalance] = React.useState<number | undefined>(
    undefined
  )

  if (chainId !== 1) {
    !errorMsg?.startsWith('Unsapported chain') &&
      setErrorMsg(`Unsapported chain Id ${chainId}. Please switch to chainId 1`)
  }

  React.useEffect(() => {
    if (library) {
      const planetsWithLootContract = new library.eth.Contract(
        PlanetsWithLoot.abi,
        PlanetsWithLoot.address
      )
      getClaimedTokenIds(planetsWithLootContract).then(setOwnedIds)
    }
  }, [library])
  React.useEffect(() => {
    if (chainId !== 1) {
      setErrorMsg(`Unsapported chain Id ${chainId}. Please switch to chainId 1`)
    } else {
      errorMsg?.startsWith('Unsapported chain') && setErrorMsg(undefined)
    }
  }, [chainId])

  React.useEffect(() => {
    if (!account) {
      setErrorMsg(`Please connect your Wallet`)
    } else {
      errorMsg?.startsWith('Please connect your') && setErrorMsg(undefined)
      getLootTokenBalance(account, library).then((resp) => setLootBalance(resp.toNumber()))
      getPlanetsWithLootTokenBalance(account, library).then((resp) =>
        setPlanetsWithLootBalance(resp.toNumber())
      )
    }
  }, [account])

  const onConnectClick = (): void => {
    activate(injected, console.error)
  }
  const onMintPlanetClick = async (): Promise<void> => {
    if (account) {
      await mintPlanet(account, library, selectedTokenId)
    }
  }
  const onMintPlanetWithLootClick = async (): Promise<void> => {
    if (!account) {
      setErrorMsg(`Please connect your Wallet!`)
      return
    }
    const hasLootInWallet = await hasLootToken(account, library)
    if (!hasLootInWallet) {
      setErrorMsg('You should have $LOOT in your wallet to be able to call mintWithLoot')
      return
    }
    await mintWithLootPlanet(account, library)
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
    <>
      <main>
        <h1>Planets with Loot</h1>
        <h2>
          Planets with Loot. Randomized Planets generated and stored on-chain. Because your Heroes
          need a place in the Universe to live too.
        </h2>
        <ul>
          <li>
            0-8000 is reserved for{' '}
            <a
              href="https://twitter.com/search?q=%24Loot&src=cashtag_click"
              target="_blank"
              rel="noreferrer noopener">
              $LOOT
            </a>{' '}
            Holders
          </li>

          <li>8001-12000 is open for minting at 0.05 ETH</li>
        </ul>
        <p>
          Keep in mind that mintWithLoot function would be available only until Thu Sep 30 2021
          21:59:59 GMT+0000
        </p>
        {errorMsg && <ErrorMessage message={errorMsg} />}
        {account && <h4>You are connected as {account}</h4>}
        {account && (
          <div>
            <div>$LOOT balance: {lootBalance || 0}</div>
            <div>$PLTL balance: {planetsWithLootBalance || 0}</div>
          </div>
        )}

        {account && chainId !== 1 && (
          <section className="actions">
            <Button onClick={onMainnetSwitchClick}>Switch to Ethereum Mainnet</Button>{' '}
          </section>
        )}
        {!account && (
          <section className="actions">
            <ConnectWallet onConnectClick={onConnectClick} />
          </section>
        )}
        {account && chainId === 1 && (
          <section className="actions">
            <Button
              onClick={onMintPlanetClick}
              disabled={selectedTokenId !== undefined && selectedTokenId < 8001}
              reason={'You should select ID in range 8001-12000'}>
              Mint planet!
            </Button>
            <Button
              onClick={onMintPlanetWithLootClick}
              disabled={lootBalance === 0}
              reason={'You should have $LOOT in your wallet to call this method'}>
              Mint planet with Loot!
            </Button>
          </section>
        )}
        {ownedIds && ownedIds.length > 0 && (
          <section className="grid">
            <p>
              You are able to select not-claimed token ID in range 8001-12000 and click Mint Planet!
              to mint desired token. Otherwise you will mint random token id. This feature doesn't
              work for Mint Planet with Loot (only random token could be minted using this method)
            </p>
            {selectedTokenId && <div className="selected-id">Selected ID {selectedTokenId}</div>}
            <div className="grid-container">
              {fillArrayRange(0, 12000).map((n, i) => {
                const isOwned = ownedIds.includes(n)
                const style = isOwned ? { backgroundColor: 'rgb(180, 180, 180)' } : {}
                return (
                  <div
                    onClick={(): void => {
                      if (isOwned === false) {
                        setSelectedTokenId(n)
                      }
                    }}
                    key={`grid-element-${i}`}
                    style={style}
                    title={i.toString()}
                    className={selectedTokenId === n ? 'selected grid-item' : 'grid-item'}></div>
                )
              })}
            </div>
          </section>
        )}

        <footer>
          <a
            href="https://github.com/sneg55/lootplanets-site"
            target="_blank"
            rel="noreferrer noopener">
            Github
          </a>
          <a href="https://twitter.com/LootPlanets" target="_blank" rel="noreferrer noopener">
            Twitter
          </a>
          <a
            href="https://etherscan.io/address/0x15e32bac6c5f89c66631f3a8391bc49eacc03985"
            target="_blank"
            rel="noreferrer noopener">
            Etherscan
          </a>
        </footer>
      </main>
    </>
  )
}
export default App

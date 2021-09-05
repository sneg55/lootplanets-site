import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import Loot from '../contracts/Loot'
import PlanetsWithLoot from '../contracts/PlanetsWithLoot'

export const mintPlanet = async (
  account: string,
  web3: Web3,
  selectedTokenId?: number
): Promise<void> => {
  const planetIds = fillArrayRange(8001, 12000)
  const planetsWithLootContract = new web3.eth.Contract(
    PlanetsWithLoot.abi,
    PlanetsWithLoot.address
  )
  const payableAmount = 0.05
  const claimedTokenIds = await getClaimedTokenIds(planetsWithLootContract)
  const availablePlanetIds = planetIds.filter((el) => !claimedTokenIds.includes(el))
  const randomPlanetId = availablePlanetIds[Math.floor(Math.random() * availablePlanetIds.length)]
  const tokenId =
    selectedTokenId && selectedTokenId >= 8001 && selectedTokenId <= 12000
      ? selectedTokenId
      : randomPlanetId
  await planetsWithLootContract.methods.mint(tokenId).send({
    from: account,
    value: new BigNumber(payableAmount).times(10 ** 18).toFixed(),
  })
}

export const mintWithLootPlanet = async (account: string, web3: Web3): Promise<void> => {
  const planetsWithLootContract = new web3.eth.Contract(
    PlanetsWithLoot.abi,
    PlanetsWithLoot.address
  )
  const lootId = await getLootId(account, 0, web3)
  await planetsWithLootContract.methods.mintWithLoot(lootId).send({
    from: account,
    value: 0,
  })
}

export const getClaimedTokenIds = async (contract: Contract): Promise<number[]> => {
  const transferEventsData = await contract.getPastEvents('Transfer', {
    fromBlock: 12865228,
    toBlock: 'latest',
  })
  const claimedTokenIds = transferEventsData.map((e) => e.returnValues['tokenId'])
  return claimedTokenIds.map((e) => parseInt(e))
}

export const fillArrayRange = (start: number, end: number): number[] => {
  const array = []
  for (let i = start; i <= end; i++) {
    array.push(i)
  }
  return array
}

export const getLootTokenBalance = async (account: string, web3: Web3): Promise<BigNumber> => {
  const lootContract = new web3.eth.Contract(Loot.abi, Loot.address)
  const lootBalance = await lootContract.methods.balanceOf(account).call()
  return new BigNumber(lootBalance)
}

export const getPlanetsWithLootTokenBalance = async (
  account: string,
  web3: Web3
): Promise<BigNumber> => {
  const planetsWithLootContract = new web3.eth.Contract(
    PlanetsWithLoot.abi,
    PlanetsWithLoot.address
  )
  const planetsWithLootBalance = await planetsWithLootContract.methods.balanceOf(account).call()
  return new BigNumber(planetsWithLootBalance)
}

export const hasLootToken = async (account: string, web3: Web3): Promise<boolean> => {
  const lootBalance = await getLootTokenBalance(account, web3)
  return lootBalance.gt(0)
}

export const getLootId = async (account: string, index: number, web3: Web3): Promise<number> => {
  const lootContract = new web3.eth.Contract(Loot.abi, Loot.address)
  const lootId = await lootContract.methods.tokenOfOwnerByIndex(account, index).call()
  return lootId
}

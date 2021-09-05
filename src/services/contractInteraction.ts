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

export type PlanetData = {
  image: string
  name?: string
  organisms?: string
  resource?: string
  rings?: string
  terrain?: string
  tokenId: number
  water?: string
  tokenURIData: TokenURIData
}

export type TokenURIAttributes = {
  trait_type: string // "Water"
  value: string // Seas
}
export type TokenURIData = {
  description: string //'Planets with Loot!'
  image: string // 'https://ipfs.io/ipfs/Qmcwjem8w5ij1MmDbgiwQy3rtu2bTVCV6ZvNbPvzKkhiqx/1056/1056.png'
  name: string // 'Planet with Loot # 1056'
  attributes: TokenURIAttributes[]
}

export const getPlanetData = async (tokenId: number): Promise<PlanetData> => {
  const tokenURI = `https://gateway.pinata.cloud/ipfs/QmbEKx9dFrLWHmNUHbUwBCSA5pojaGpSVEHYChXAC1vqNM/${tokenId}`
  const tokenURIData: TokenURIData = await fetch(tokenURI).then((res) => res.json())
  const image = tokenURIData.image
  const water = tokenURIData.attributes.find((e) => e.trait_type === 'Water')?.value
  const organisms = tokenURIData.attributes.find((e) => e.trait_type === 'Organisms')?.value
  const terrain = tokenURIData.attributes.find((e) => e.trait_type === 'Terrain')?.value
  const name = tokenURIData.attributes.find((e) => e.trait_type === 'Name')?.value
  const rings = tokenURIData.attributes.find((e) => e.trait_type === 'Rings')?.value
  const resource = tokenURIData.attributes.find((e) => e.trait_type === 'Resource')?.value
  return { tokenId, name, organisms, rings, terrain, resource, water, image, tokenURIData }
}

export const getThreeRandomPlanets = async (): Promise<PlanetData[]> => {
  const result = []

  // Shuffle array
  const shuffled = fillArrayRange(0, 12000).sort(() => 0.5 - Math.random())
  // Get sub-array of first n elements after shuffled
  const randomPlanetsIds = shuffled.slice(0, 3)

  for (let i = 0; i <= 2; i++) {
    const tokenId = randomPlanetsIds[i]
    const planetData = await getPlanetData(tokenId)
    result.push(planetData)
  }
  return result
}

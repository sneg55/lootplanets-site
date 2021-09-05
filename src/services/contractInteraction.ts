import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import PlanetsWithLoot from '../contracts/PlanetsWithLoot'

export const mintPlanet = async (account: string, web3: Web3): Promise<void> => {
  const planetIds = fillArrayRange(8001, 12000)
  const planetsWithLootContract = new web3.eth.Contract(
    PlanetsWithLoot.abi,
    PlanetsWithLoot.address
  )
  const payableAmount = 0.05
  const claimedTokenIds = await getClaimedTokenIds(planetsWithLootContract)
  const availablePlanetIds = planetIds.filter((el) => !claimedTokenIds.includes(el))
  const randomPlanetId = availablePlanetIds[Math.floor(Math.random() * availablePlanetIds.length)]

  await planetsWithLootContract.methods.mint(new BigNumber(randomPlanetId)).send({
    from: account,
    value: new BigNumber(payableAmount).times(10 ** 18),
  })
}

const getClaimedTokenIds = async (contract: Contract): Promise<number[]> => {
  const transferEventsData = await contract.getPastEvents('Transfer', {
    fromBlock: 12865228,
    toBlock: 'latest',
  })
  const claimedTokenIds = transferEventsData.map((e) => e.returnValues['tokenId'])
  return claimedTokenIds.map(parseInt)
}

const fillArrayRange = (start: number, end: number): number[] => {
  const array = []
  for (let i = start; i <= end; i++) {
    array.push(i)
  }
  return array
}

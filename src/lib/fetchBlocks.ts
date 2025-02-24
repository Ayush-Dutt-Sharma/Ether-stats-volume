import { ethers } from 'ethers'
import alchemy from './alchemy'

export async function fetchLatestBlocks() {
  const latestBlockNumber = await alchemy.core.getBlockNumber()
  const blocks = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      alchemy.core.getBlock(latestBlockNumber - i)
    )
  )
  return blocks.reverse() // Oldest to newest
}


export async function getERC20TransferVolume(block: any, tokenAddress: string) {
  try {
    const logs = await alchemy.core.getLogs({
      fromBlock: block.number,
      toBlock: block.number,
      address: tokenAddress,
      topics: [ethers.id('Transfer(address,address,uint256)')],
    })

    const totalVolume = logs.reduce((acc: number, log: any) => {
      try {
        const value = ethers.AbiCoder.defaultAbiCoder().decode(
          ['uint256'],
          log.data
        )[0]

        return acc + Number(value)
      } catch (decodeError) {
        console.error('Failed to decode log data:', decodeError, log)
        return acc
      }
    }, 0)

    return Number(parseFloat((totalVolume).toString()).toFixed(2))
  } catch (error) {
    console.error('Error fetching ERC20 transfer volume:', error)
    throw new Error('Failed to fetch ERC20 transfer volume data.')
  }
}

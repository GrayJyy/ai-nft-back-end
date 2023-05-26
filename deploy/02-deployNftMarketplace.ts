import { DeployFunction } from 'hardhat-deploy/dist/types'
import { developChain } from '../helperHardhatConfig'
import verify from '../utils/verify'
import { WAIT_CONFIRMATIONS } from '../constants/constant'

const deployNftMarketplace: DeployFunction = async hre => {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const args: any[] = []

  const waitConfirmations = developChain.includes(network.name) ? 1 : WAIT_CONFIRMATIONS
  log('deploy nftMarketplace start...')
  const nftMarketplace = await deploy('NftMarketplace', {
    from: deployer,
    args,
    log: true,
    waitConfirmations,
  })

  log('deploy nftMarketplace end!')
  log('-----------------------------------------------------------------------------')

  if (!developChain.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(nftMarketplace.address, args)
  }
}

deployNftMarketplace.tags = ['all', 'main', 'nftmarketplace']
export default deployNftMarketplace

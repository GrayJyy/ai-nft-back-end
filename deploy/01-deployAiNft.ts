import { DeployFunction } from 'hardhat-deploy/dist/types'
import { developChain } from '../helperHardhatConfig'
import { WAIT_CONFIRMATIONS } from '../constants/constant'
import verify from '../utils/verify'
import { ethers } from 'hardhat'

const COST = ethers.utils.parseEther('0.01')
const deployAiNft: DeployFunction = async ({ deployments, network, getNamedAccounts }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const waitConfirmations = developChain.includes(network.name) ? 1 : WAIT_CONFIRMATIONS
  const args = ['AiNft', 'ANFT', COST]
  log('Deploying...')
  const aiNft = await deploy('AiNft', {
    from: deployer,
    log: true,
    args,
    waitConfirmations,
  })
  log(`Deployed AiNft contract at address: ${aiNft.address} ,the network is ${network.name}`)
  log('---------------------------------------------------------------------------------------------')
  if (!developChain.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    verify(aiNft.address, args)
  }
}
deployAiNft.tags = ['all', 'ainft']
export default deployAiNft

import fs from 'fs'
import { deployments, network } from 'hardhat'
import 'hardhat-deploy'
import { ABI2_PATH, ABI_PATH, ADDRESS_PATH } from '../constants/constant'

const update = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log('Updating front-end...')
    await updateAbi()
    await updateContractAddress()
    console.log('Finish!')
    console.log('-----------------------------------------------------------------------------')
  }
}

export const updateAbi = async () => {
  await deployments.fixture(['ainft', 'nftmarketplace'])
  const aiNftDeployment = await deployments.get('AiNft')
  const nftMarketplaceDeployment = await deployments.get('NftMarketplace')
  const abi = aiNftDeployment.abi
  const abi2 = nftMarketplaceDeployment.abi
  fs.writeFileSync(ABI_PATH, JSON.stringify(abi))
  fs.writeFileSync(ABI2_PATH, JSON.stringify(abi2))
}

const updateContractAddress = async () => {
  await deployments.fixture(['ainft', 'nftmarketplace'])
  const aiNftDeployment = await deployments.get('AiNft')
  const nftMarketplaceDeployment = await deployments.get('NftMarketplace')
  const address = aiNftDeployment.address
  const address2 = nftMarketplaceDeployment.address
  const currentAddress = JSON.parse(fs.readFileSync(ADDRESS_PATH, 'utf8'))
  const chainId = network.config.chainId!.toString()
  if (chainId in currentAddress) {
    if (!currentAddress[chainId]['aiNft'].includes(address)) {
      currentAddress[chainId]['aiNft'].push(address)
    }
    if (!currentAddress[chainId]['nftMarketplace'].includes(address2)) {
      currentAddress[chainId]['nftMarketplace'].push(address2)
    }
  } else {
    currentAddress[chainId] = { aiNft: [address], nftMarketplace: [address2] }
  }

  fs.writeFileSync(ADDRESS_PATH, JSON.stringify(currentAddress))
}
update.tags = ['all', 'update']
export default update

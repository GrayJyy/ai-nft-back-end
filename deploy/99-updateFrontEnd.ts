import fs from 'fs'
import { deployments, network } from 'hardhat'
import 'hardhat-deploy'
import { ABI_PATH, ADDRESS_PATH } from '../constants/constant'

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
  await deployments.fixture(['ainft'])
  const aiNftDeployment = await deployments.get('AiNft')
  const abi = aiNftDeployment.abi
  fs.writeFileSync(ABI_PATH, JSON.stringify(abi))
}

const updateContractAddress = async () => {
  await deployments.fixture(['ainft'])
  const aiNftDeployment = await deployments.get('AiNft')
  const address = aiNftDeployment.address
  const currentAddress = JSON.parse(fs.readFileSync(ADDRESS_PATH, 'utf8'))
  const chainId = network.config.chainId!.toString()
  if (chainId in currentAddress) {
    if (!currentAddress[chainId]['aiNft'].includes(address)) {
      currentAddress[chainId]['aiNft'].push(address)
    }
  } else {
    currentAddress[chainId] = { aiNft: [address] }
  }

  fs.writeFileSync(ADDRESS_PATH, JSON.stringify(currentAddress))
}
update.tags = ['all', 'update']
export default update

import { deployments, ethers, getNamedAccounts } from 'hardhat'
import 'hardhat-deploy'
import { COST } from '../constants/constant'

async function mintAiNft() {
  const { deployer } = await getNamedAccounts()
  const account = await ethers.getSigner(deployer)
  await deployments.fixture(['ainft'])
  const aiNftDeployment = await deployments.get('AiNft')
  const aiNft = await ethers.getContractAt('AiNft', aiNftDeployment.address, account)
  console.log('Minting...')
  const tx = await aiNft.mintNft('', { value: COST })
  const txReceipt = await tx.wait()
  const tokenId: BigInt = txReceipt!.events![1].args!.tokenId
  console.log(`mint an aiNft which tokenId is ${tokenId.toString()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mintAiNft().catch(error => {
  console.error(error)
  process.exitCode = 1
})

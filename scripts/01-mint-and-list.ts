import { deployments, ethers, getNamedAccounts } from 'hardhat'
import 'hardhat-deploy'

const COST = ethers.utils.parseEther('0.01')

async function mintAiNft() {
  const { deployer } = await getNamedAccounts()
  const account = await ethers.getSigner(deployer)
  await deployments.fixture(['ainft'])
  const aiNftDeployment = await deployments.get('AiNft')
  const aiNft = await ethers.getContractAt('AiNft', aiNftDeployment.address, account)
  const nftMarketplaceDeployment = await deployments.get('NftMarketplace')
  const nftMarketplace = await ethers.getContractAt('NftMarketplace', nftMarketplaceDeployment.address)
  console.log('Minting...')
  const tx = await aiNft.mintNft('', { value: COST })
  const txReceipt = await tx.wait()
  const tokenId = txReceipt!.events![1].args!.tokenId
  console.log(`mint an aiNft which tokenId is ${tokenId.toString()}`)
  console.log('----------------------------------Step 1')
  const approveTx = await aiNft.approve(nftMarketplace.address, tokenId)
  await approveTx.wait()
  console.log('NFT Approved!')
  console.log('----------------------------------Step 2')
  console.log('Listing NFT...')
  const listTx = await nftMarketplace.listItem(aiNft.address, tokenId, COST)
  await listTx.wait()
  console.log('NFT Listed!')
  console.log('----------------------------------Step 3')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mintAiNft().catch(error => {
  console.error(error)
  process.exitCode = 1
})

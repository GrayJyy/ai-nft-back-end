import { deployments, ethers, getNamedAccounts } from 'hardhat'
import { AiNft } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { assert, expect } from 'chai'
import { COST } from '../constants/constant'

describe('AiNft', () => {
  let aiNft: AiNft
  let account: SignerWithAddress
  beforeEach(async () => {
    const { deployer } = await getNamedAccounts()
    account = await ethers.getSigner(deployer)
    await deployments.fixture(['ainft'])
    const aiNftDeployment = await deployments.get('AiNft')
    aiNft = await ethers.getContractAt('AiNft', aiNftDeployment.address, account)
  })

  describe('mintNft', () => {
    it('Should increases the token counter and emits an event', async () => {
      assert.equal((await aiNft.totalSupply()).toString(), '0')
      await expect(aiNft.mintNft('', { value: COST })).to.emit(aiNft, 'Minted')
      assert.equal((await aiNft.totalSupply()).toString(), '1')
    })
    it('Should reverts if not pay enough', async () => {
      await expect(aiNft.mintNft('')).to.be.revertedWithCustomError(aiNft, 'AiNft__PaymentIsNotEnough')
    })
  })
  describe('withdraw', () => {
    it('Should reverts if nobody minted', async () => {
      await expect(aiNft.withdraw()).to.be.revertedWithCustomError(aiNft, 'AiNft__BalanceIsZero')
    })
  })
})

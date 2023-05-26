import { deployments, ethers, getNamedAccounts } from 'hardhat'
import { AiNft } from '../../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { assert, expect } from 'chai'

const COST = ethers.utils.parseEther('0.01')

describe('AiNft', () => {
  let aiNft: AiNft
  let account: SignerWithAddress
  let account2: SignerWithAddress
  beforeEach(async () => {
    await deployments.fixture(['ainft'])
    const { deployer, user } = await getNamedAccounts()
    account = await ethers.getSigner(deployer)
    account2 = await ethers.getSigner(user)
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
    it('Should update the balance', async () => {
      const { deployer } = await getNamedAccounts()
      const balanceBefore = await ethers.provider.getBalance(deployer)
      aiNft = aiNft.connect(account2)
      await aiNft.mintNft('', { value: COST })
      aiNft = aiNft.connect(account)
      await aiNft.withdraw()
      const balanceAfter = await ethers.provider.getBalance(deployer)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
      const contractBalance = await ethers.provider.getBalance(aiNft.address)
      assert.equal(contractBalance.toString(), '0')
    })
  })
})

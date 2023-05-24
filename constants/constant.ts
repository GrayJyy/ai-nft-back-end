import { ethers } from 'hardhat'

const GAS = 8000000000
const GAS_PRICE = 210000
const WAIT_CONFIRMATIONS = 6
const COST = ethers.utils.parseEther('0.01')
export { GAS, GAS_PRICE, WAIT_CONFIRMATIONS, COST }

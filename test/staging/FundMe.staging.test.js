const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")


developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("1")

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
              console.log(deployer)
              console.log(fundMe.address)
          })

          it("allows people to fund and withdraw", async () => {
            // await fundMe.fund({value: sendValue})
            const startingBalance = await fundMe.provider.getBalance(fundMe.address)
            console.log(startingBalance.toString())
            //await fundMe.withdraw({})
            const endingBalance = await fundMe.provider.getBalance(fundMe.address)
            assert.equal(endingBalance.toString(), "0")
          })
      })

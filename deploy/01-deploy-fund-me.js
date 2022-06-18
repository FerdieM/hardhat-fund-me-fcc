const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network, deployments, getNamedAccounts } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    //console.log("Hi!")
    // hre.getNamedAccounts()
    // hre.deployments
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUusPriceFeedAddress = networkConfig[chainId]["ethusdPriceFeed"]

    let ethUsdPriceFeedAddress

    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }

    // console.log(chainId)
    // console.log(networkConfig[chainId].ethUsdPriceFeed)
    // console.log(ethUsdPriceFeedAddress)
    // if the contract doesn't exists we deploy a minimum version for local testing

    // well what happens when we want to change chains?
    // when going to localhost or hardhat network we want to use a mock

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // put price feed address
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("------------------------------")
    log(`FundMe deployed at ${fundMe.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.tags = ["all", "fundme"]

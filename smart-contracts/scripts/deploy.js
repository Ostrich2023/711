const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const SkillWallet = await hre.ethers.getContractFactory("SkillWallet");
    const skillWallet = await SkillWallet.deploy(); 
    await skillWallet.waitForDeployment(); 

    console.log("SkillWallet deployed to:", await skillWallet.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
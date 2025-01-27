const hre = require("hardhat");

async function main() {
    const unlockTime = Math.floor(Date.now() / 1000) + 60; // e.g. 1 minute from now
    const Lock = await hre.ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, {
        value: hre.ethers.parseEther("0.001"),
    });
    await lock.waitForDeployment();
    console.log(`Lock contract deployed to: ${lock.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
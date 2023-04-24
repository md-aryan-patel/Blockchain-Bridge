const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();

  const Bridge = await hre.ethers.getContractFactory("BridgeMain");
  const bridge = await Bridge.deploy(token.address);
  await bridge.deployed();

  console.log(`Bridge deployed to: ${bridge.address}`);
  console.log(`Token deployed to: ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

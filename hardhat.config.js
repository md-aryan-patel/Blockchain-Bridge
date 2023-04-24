require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.9",

  defaultNetwork: "network",

  networks: {
    network: {
      url: process.env.sepolia_network,
      accounts: [process.env.admin_private_key],
    },
  },
};

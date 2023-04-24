const { ethers } = require("hardhat");
const abi = require("../artifacts/contracts/BridgeMain.sol/BridgeMain.json");
const tokenAbi = require("../artifacts/contracts/Token.sol/Token.json");
require("dotenv").config();

const sepoliaUrl = process.env.sepolia_network;
const polygonUrl = process.env.polygon_network;

const SepoliaProvider = (() => {
  let provider;
  const createProvider = () => {
    provider = new ethers.providers.JsonRpcProvider(sepoliaUrl);
    return provider;
  };
  return {
    getSepoliaProvider: () => {
      if (!provider) provider = createProvider();
      return provider;
    },
  };
})();

const PolygonProvider = (() => {
  let provider;
  const createProvider = () => {
    provider = new ethers.providers.JsonRpcProvider(polygonUrl);
    return provider;
  };
  return {
    getPolygonProvider: () => {
      if (!provider) provider = createProvider();
      return provider;
    },
  };
})();

const SepoliaWallet = (() => {
  let wallet;
  const createWallet = (_privateKey) => {
    wallet = new ethers.Wallet(
      _privateKey,
      SepoliaProvider.getSepoliaProvider()
    );
    return wallet;
  };

  return {
    getSepoliaWallet: (_privateKey) => {
      if (!wallet) wallet = createWallet(_privateKey);
      return wallet;
    },
  };
})();

const PolygonWallet = (() => {
  let wallet;
  const createWallet = (_privateKey) => {
    wallet = new ethers.Wallet(
      _privateKey,
      PolygonProvider.getPolygonProvider()
    );
    return wallet;
  };

  return {
    getPolygonWallet: (_privateKey) => {
      if (!wallet) wallet = createWallet(_privateKey);
      return wallet;
    },
  };
})();

const SepoliaBridge = (() => {
  let contract;
  const createContract = () => {
    contract = new ethers.Contract(
      process.env.sepo_bridge,
      abi.abi,
      SepoliaProvider.getSepoliaProvider()
    );
    return contract;
  };

  return {
    getContract: () => {
      if (!contract) contract = createContract();
      return contract;
    },
  };
})();

const PolygonBridge = (() => {
  let contract;
  const createContract = () => {
    contract = new ethers.Contract(
      process.env.poly_bridge,
      abi.abi,
      PolygonProvider.getPolygonProvider()
    );
    return contract;
  };

  return {
    getContract: () => {
      if (!contract) contract = createContract();
      return contract;
    },
  };
})();

const SepoliaToken = (() => {
  let contract;
  const createContract = () => {
    contract = new ethers.Contract(
      process.env.sepo_token,
      tokenAbi.abi,
      SepoliaProvider.getSepoliaProvider()
    );
    return contract;
  };

  return {
    getToken: () => {
      if (!contract) contract = createContract();
      return contract;
    },
  };
})();

const PolygonToken = (() => {
  let contract;
  const createContract = () => {
    contract = new ethers.Contract(
      process.env.poly_token,
      tokenAbi.abi,
      PolygonProvider.getPolygonProvider()
    );
    return contract;
  };

  return {
    getToken: () => {
      if (!contract) contract = createContract();
      return contract;
    },
  };
})();

module.exports = {
  SepoliaBridge,
  SepoliaProvider,
  SepoliaWallet,
  SepoliaToken,
  PolygonBridge,
  PolygonProvider,
  PolygonWallet,
  PolygonToken,
};

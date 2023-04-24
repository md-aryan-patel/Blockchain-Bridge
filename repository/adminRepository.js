const {
  SepoliaWallet,
  SepoliaToken,
  PolygonToken,
  PolygonWallet,
} = require("../di/mainModule");
require("dotenv").config();
const { toWei } = require("../utils/converter");

const admin_key = process.env.admin_private_key;
const user = process.env.user_address;

const wallet = SepoliaWallet.getSepoliaWallet(admin_key);
const token = SepoliaToken.getToken();

const altWallet = PolygonWallet.getPolygonWallet(admin_key);
const altToken = PolygonToken.getToken();

const mintInitialOnSepolia = async (_user, _amount) => {
  const result = await token.connect(wallet).mint(_user, _amount);
  console.log(result);
};

const mintInitialOnPolygon = async (_user, _amount) => {
  const result = await altToken.connect(altWallet).mint(_user, _amount);
  console.log(result);
};

const getBalanceOnSepolia = async (_account) => {
  const result = await token.balanceOf(_account);
  return result;
};

const getBalanceOnPolygon = async (_account) => {
  const result = await altToken.balanceOf(_account);
  return result;
};

const main = async () => {
  //   await mintInitialOnPolygon(user, toWei(10));
  //   await mintInitialOnSepolia(user, toWei(100));
  const polygonBalance = await getBalanceOnPolygon(user);
  const sepoliaBalance = await getBalanceOnSepolia(user);
  console.log(`User balance on  sepolia: ${sepoliaBalance}`);
  console.log(`User balance on  polygon: ${polygonBalance}`);
};

main();

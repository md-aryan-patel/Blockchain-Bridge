const { SepoliaBridge, SepoliaWallet } = require("../di/mainModule");
require("dotenv").config();
const { toWei } = require("../utils/converter");

const admin_key = process.env.admin_private_key;
const user_key = process.env.user_private_key;

const userWallet = SepoliaWallet.getSepoliaWallet(user_key);
const adminWallet = SepoliaWallet.getSepoliaWallet(admin_key);

const contract = SepoliaBridge.getContract();

contract.on("Switch", (from, to, amount, nonce, timestamp, state) => {
  console.log(`From: ${from}`);
  console.log(`to: ${to}`);
  console.log(`amount: ${amount}`);
  console.log(`nonce: ${nonce}`);
  console.log(`timstampe: ${timestamp}`);
  console.log(`state: ${state}`);
});

const burn = async (_to, _amount, _nonce) => {
  const result = await contract.connect(userWallet).burn(_to, _amount, _nonce);
  console.log(result.hash);
};

burn(process.env.user_address, toWei(1), 1);

module.exports = { burn };

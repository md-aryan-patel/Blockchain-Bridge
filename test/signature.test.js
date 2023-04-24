const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config();

const toWei = (num) => ethers.utils.parseEther(num.toString());

describe("Signature contract", () => {
  let signature, accounts;
  beforeEach(async () => {
    accounts = await ethers.getSigners(2);
    const Signature = await hre.ethers.getContractFactory("VerifySignature");
    signature = await Signature.deploy();
    await signature.deployed();
  });

  describe("Signature should match", () => {
    const amount = toWei(1);
    const nonce = 1;
    const message = "Hello";

    it("Should match signature", async () => {
      const to = accounts[1].address;
      const signer = new ethers.Wallet(process.env.admin_private_key);

      let hash = await signature.getMessageHash(to, amount, message, nonce);
      const sig = await signer.signMessage(ethers.utils.arrayify(hash));
      console.log(`Signature: ${sig}`);
      const ethHash = await signature.getEthSignedMessageHash(hash);
      console.log(`ethHash: ${ethHash}`);
      console.log(
        "recovered signer: ",
        await signature.recoverSigner(ethHash, sig)
      );
    });
  });
});

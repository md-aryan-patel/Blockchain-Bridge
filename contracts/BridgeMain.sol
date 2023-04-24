// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Token.sol";

contract BridgeMain {
    address admin;
    Token token;

    mapping(address => mapping(uint256 => bool)) compleatedTransaction;

    enum State {
        Burn,
        Mint
    }

    constructor(address _token) {
        admin = msg.sender;
        token = Token(_token);
    }

    event Switch(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        uint256 timestamp,
        State indexed state
    );

    function burn(address _to, uint256 _amount, uint256 _nonce) public {
        require(
            compleatedTransaction[msg.sender][_nonce] == false,
            "Bridge: Transaction already Exist"
        );
        compleatedTransaction[msg.sender][_nonce] = true;
        token.burn(msg.sender, _amount);
        emit Switch(
            msg.sender,
            _to,
            _amount,
            _nonce,
            block.timestamp,
            State.Burn
        );
    }

    function mint(
        address _from,
        address _to,
        uint256 _amount,
        uint256 _nonce,
        bytes calldata signature
    ) public {
        bytes32 hash = getMessageHash(_from, _to, _amount, _nonce);
        address signer = recoverSigner(hash, signature);
        require(
            compleatedTransaction[_from][_nonce] == false,
            "Bridge: Transaction already Exist"
        );
        require(signer == _from, "Bridge: Invalid signer");
        token.mint(_to, _amount);
        emit Switch(
            msg.sender,
            _to,
            _amount,
            _nonce,
            block.timestamp,
            State.Mint
        );
    }

    // Signature verification
    function getMessageHash(
        address _from,
        address _to,
        uint _amount,
        uint _nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_from, _to, _amount, _nonce));
    }

    function getEthSignedMessageHash(
        bytes32 _messageHash
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function verify(
        address _signer,
        address _to,
        uint _amount,
        uint _nonce,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_signer, _to, _amount, _nonce);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == _signer;
    }

    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}

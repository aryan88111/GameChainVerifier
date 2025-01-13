// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GameProofVerifier is Ownable {
    struct GameProof {
        uint256 playerScore;
        uint256 verificationThreshold;
        bytes32 proofHash;
        uint256 timestamp;
        address player;
    }

    mapping(bytes32 => GameProof) public proofs;
    mapping(address => uint256) public playerScores;

    event ProofSubmitted(
        address indexed player,
        uint256 score,
        bytes32 proofHash
    );
    event ProofVerified(
        address indexed player,
        uint256 score,
        bytes32 proofHash
    );

    function submitProof(
        uint256 score,
        uint256 threshold,
        bytes32 proofHash
    ) public {
        require(score > 0, "Score must be greater than zero");
        require(threshold > 0, "Threshold must be greater than zero");

        GameProof memory proof = GameProof({
            playerScore: score,
            verificationThreshold: threshold,
            proofHash: proofHash,
            timestamp: block.timestamp,
            player: msg.sender
        });

        bytes32 proofId = keccak256(
            abi.encodePacked(
                msg.sender,
                score,
                threshold,
                proofHash,
                block.timestamp
            )
        );

        proofs[proofId] = proof;
        emit ProofSubmitted(msg.sender, score, proofHash);
    }

    function verifyGameStats(bytes32 proofId) public view returns (bool) {
        GameProof memory proof = proofs[proofId];
        require(proof.player != address(0), "Proof does not exist");
        
        return proof.playerScore >= proof.verificationThreshold;
    }

    function updatePlayerScore(address player, uint256 newScore) public onlyOwner {
        require(player != address(0), "Invalid player address");
        playerScores[player] = newScore;
    }

    function getPlayerScore(address player) public view returns (uint256) {
        return playerScores[player];
    }
}

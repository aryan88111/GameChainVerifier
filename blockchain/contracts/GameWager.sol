// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameWager is ReentrancyGuard, Ownable {
    struct Wager {
        address player1;
        address player2;
        uint256 amount;
        bool resolved;
        bytes32 gameHash;
        uint256 createdAt;
    }

    mapping(uint256 => Wager) public wagers;
    uint256 public wagerCount;
    uint256 public constant TIMEOUT_DURATION = 24 hours;

    event WagerCreated(uint256 indexed wagerId, address player1, address player2, uint256 amount);
    event WagerAccepted(uint256 indexed wagerId, address player2);
    event WagerResolved(uint256 indexed wagerId, address winner, uint256 amount);
    event WagerCancelled(uint256 indexed wagerId);

    function createWager(address opponent, bytes32 gameHash) public payable {
        require(msg.value > 0, "Wager amount must be greater than zero");
        require(opponent != address(0), "Invalid opponent address");
        require(opponent != msg.sender, "Cannot wager against yourself");

        wagers[wagerCount] = Wager({
            player1: msg.sender,
            player2: opponent,
            amount: msg.value,
            resolved: false,
            gameHash: gameHash,
            createdAt: block.timestamp
        });

        emit WagerCreated(wagerCount, msg.sender, opponent, msg.value);
        wagerCount++;
    }

    function acceptWager(uint256 wagerId) public payable nonReentrant {
        Wager storage wager = wagers[wagerId];
        require(!wager.resolved, "Wager already resolved");
        require(msg.sender == wager.player2, "Only designated player can accept");
        require(msg.value == wager.amount, "Must match wager amount");

        emit WagerAccepted(wagerId, msg.sender);
    }

    function resolveWager(uint256 wagerId, address winner) public nonReentrant {
        Wager storage wager = wagers[wagerId];
        require(!wager.resolved, "Wager already resolved");
        require(
            msg.sender == wager.player1 || msg.sender == wager.player2,
            "Only participants can resolve wager"
        );
        require(
            winner == wager.player1 || winner == wager.player2,
            "Winner must be a participant"
        );

        wager.resolved = true;
        uint256 totalAmount = wager.amount * 2;
        payable(winner).transfer(totalAmount);

        emit WagerResolved(wagerId, winner, totalAmount);
    }

    function cancelWager(uint256 wagerId) public nonReentrant {
        Wager storage wager = wagers[wagerId];
        require(!wager.resolved, "Wager already resolved");
        require(
            msg.sender == wager.player1,
            "Only wager creator can cancel"
        );
        require(
            block.timestamp >= wager.createdAt + TIMEOUT_DURATION,
            "Cannot cancel before timeout"
        );

        wager.resolved = true;
        payable(wager.player1).transfer(wager.amount);

        emit WagerCancelled(wagerId);
    }
}

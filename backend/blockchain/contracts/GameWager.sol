// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameWager {
    struct Wager {
        address creator;
        address opponent;
        uint256 amount;
        bytes32 gameHash;
        bool accepted;
        bool completed;
        address winner;
    }

    mapping(uint256 => Wager) public wagers;
    uint256 public nextWagerId;

    event WagerCreated(uint256 wagerId, address creator, address opponent, uint256 amount, bytes32 gameHash);
    event WagerAccepted(uint256 wagerId, address opponent);
    event WagerCompleted(uint256 wagerId, address winner);

    function createWager(address opponent, bytes32 gameHash) external payable returns (uint256) {
        require(msg.value > 0, "Wager amount must be greater than 0");
        require(opponent != address(0), "Invalid opponent address");
        require(opponent != msg.sender, "Cannot wager against yourself");

        uint256 wagerId = nextWagerId++;
        wagers[wagerId] = Wager({
            creator: msg.sender,
            opponent: opponent,
            amount: msg.value,
            gameHash: gameHash,
            accepted: false,
            completed: false,
            winner: address(0)
        });

        emit WagerCreated(wagerId, msg.sender, opponent, msg.value, gameHash);
        return wagerId;
    }

    function acceptWager(uint256 wagerId) external payable {
        Wager storage wager = wagers[wagerId];
        require(!wager.accepted, "Wager already accepted");
        require(msg.sender == wager.opponent, "Not the designated opponent");
        require(msg.value == wager.amount, "Must match wager amount");

        wager.accepted = true;
        emit WagerAccepted(wagerId, msg.sender);
    }

    function completeWager(uint256 wagerId, address winner) external {
        Wager storage wager = wagers[wagerId];
        require(wager.accepted, "Wager not accepted");
        require(!wager.completed, "Wager already completed");
        require(winner == wager.creator || winner == wager.opponent, "Invalid winner");
        
        wager.completed = true;
        wager.winner = winner;
        
        uint256 totalAmount = wager.amount * 2;
        payable(winner).transfer(totalAmount);
        
        emit WagerCompleted(wagerId, winner);
    }

    function getWager(uint256 wagerId) external view returns (
        address creator,
        address opponent,
        uint256 amount,
        bytes32 gameHash,
        bool accepted,
        bool completed,
        address winner
    ) {
        Wager memory wager = wagers[wagerId];
        return (
            wager.creator,
            wager.opponent,
            wager.amount,
            wager.gameHash,
            wager.accepted,
            wager.completed,
            wager.winner
        );
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WagerContract {
    enum WagerStatus { Created, Accepted, Completed, Cancelled }

    struct Wager {
        uint256 id;
        address creator;
        address acceptor;
        uint256 gameId;
        uint256 amount;
        string description;
        WagerStatus status;
        address winner;
        uint256 createdAt;
    }

    uint256 public wagerCount;
    mapping(uint256 => Wager) public wagers;
    
    event WagerCreated(uint256 indexed wagerId, address indexed creator, uint256 amount);
    event WagerAccepted(uint256 indexed wagerId, address indexed acceptor);
    event WagerResolved(uint256 indexed wagerId, address indexed winner, uint256 amount);
    event WagerCancelled(uint256 indexed wagerId);

    modifier onlyCreator(uint256 wagerId) {
        require(msg.sender == wagers[wagerId].creator, "Only creator can perform this action");
        _;
    }

    modifier onlyAcceptor(uint256 wagerId) {
        require(msg.sender == wagers[wagerId].acceptor, "Only acceptor can perform this action");
        _;
    }

    modifier wagerExists(uint256 wagerId) {
        require(wagerId < wagerCount, "Wager does not exist");
        _;
    }

    modifier inStatus(uint256 wagerId, WagerStatus status) {
        require(wagers[wagerId].status == status, "Invalid wager status");
        _;
    }

    function createWager(uint256 gameId, uint256 amount, string memory description) external payable returns (uint256) {
        require(msg.value == amount, "Sent value must match wager amount");
        require(amount > 0, "Wager amount must be greater than 0");

        uint256 wagerId = wagerCount++;
        
        wagers[wagerId] = Wager({
            id: wagerId,
            creator: msg.sender,
            acceptor: address(0),
            gameId: gameId,
            amount: amount,
            description: description,
            status: WagerStatus.Created,
            winner: address(0),
            createdAt: block.timestamp
        });

        emit WagerCreated(wagerId, msg.sender, amount);
        return wagerId;
    }

    function acceptWager(uint256 wagerId) 
        external 
        payable 
        wagerExists(wagerId)
        inStatus(wagerId, WagerStatus.Created)
    {
        Wager storage wager = wagers[wagerId];
        require(msg.sender != wager.creator, "Creator cannot accept own wager");
        require(msg.value == wager.amount, "Must match wager amount");

        wager.acceptor = msg.sender;
        wager.status = WagerStatus.Accepted;

        emit WagerAccepted(wagerId, msg.sender);
    }

    function resolveWager(uint256 wagerId, address winner) 
        external 
        wagerExists(wagerId)
        inStatus(wagerId, WagerStatus.Accepted)
    {
        Wager storage wager = wagers[wagerId];
        require(
            msg.sender == wager.creator || msg.sender == wager.acceptor,
            "Only participants can resolve"
        );
        require(
            winner == wager.creator || winner == wager.acceptor,
            "Winner must be a participant"
        );

        wager.winner = winner;
        wager.status = WagerStatus.Completed;

        uint256 totalAmount = wager.amount * 2;
        payable(winner).transfer(totalAmount);

        emit WagerResolved(wagerId, winner, totalAmount);
    }

    function cancelWager(uint256 wagerId) 
        external 
        wagerExists(wagerId)
        onlyCreator(wagerId)
        inStatus(wagerId, WagerStatus.Created)
    {
        Wager storage wager = wagers[wagerId];
        wager.status = WagerStatus.Cancelled;
        
        payable(msg.sender).transfer(wager.amount);
        
        emit WagerCancelled(wagerId);
    }

    function getWager(uint256 wagerId) 
        external 
        view 
        wagerExists(wagerId)
        returns (
            uint256 id,
            address creator,
            address acceptor,
            uint256 gameId,
            uint256 amount,
            string memory description,
            WagerStatus status,
            address winner,
            uint256 createdAt
        )
    {
        Wager storage wager = wagers[wagerId];
        return (
            wager.id,
            wager.creator,
            wager.acceptor,
            wager.gameId,
            wager.amount,
            wager.description,
            wager.status,
            wager.winner,
            wager.createdAt
        );
    }
}

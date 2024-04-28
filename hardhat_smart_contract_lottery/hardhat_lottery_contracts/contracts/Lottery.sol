// Lottery
// Enter the lottery
// Pick a random winner (verifiable random)
// Winner to be selected X minutes -> Completely automated
// Chainlink Oracle -> Randomness, Automated Execution (Chainlink Keeper)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {VRFConsumerBaseV2, VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

error Lottery__MinimumEthRequire();
error Lottery__WithDrawlError();
error Lottery__LotteryNotOpen();
error Lottery__UpKeepNotNeeded(uint256 balance, uint256 players, uint256 state);

contract Lottery is VRFConsumerBaseV2, AutomationCompatibleInterface {
    /* Type declarations */
    enum LotteryState {
        OPEN,
        CALCULATING
    }

    /* State Variables */
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

    uint256 private immutable i_entranceFee;
    address payable[] private s_players; // if one player wins, then we need to pay them (so payable address)
    bytes32 private immutable i_keyHash; // gasLane
    uint64 private immutable s_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    uint32 private immutable i_callbackGasLimit;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    /* Lottery Variables */
    address private s_recentWinner;
    LotteryState private s_lotteryState;

    /* Events */
    event Lottery__PlayerEntered(address indexed player);
    event RequestedLotteryWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address _vrfCoordinator,
        uint256 _entranceFee,
        bytes32 _keyHash,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit,
        uint256 _interval
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        i_entranceFee = _entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        i_keyHash = _keyHash;
        s_subscriptionId = _subscriptionId;
        i_callbackGasLimit = _callbackGasLimit;
        s_lotteryState = LotteryState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = _interval;
    }

    function enterLottery() public payable {
        if (msg.value < i_entranceFee) {
            revert Lottery__MinimumEthRequire();
        }
        if (s_lotteryState != LotteryState.OPEN) {
            revert Lottery__LotteryNotOpen();
        }
        s_players.push(payable(msg.sender));
        emit Lottery__PlayerEntered(msg.sender);
    }

    /**
     * @dev This is the function that the chainlink automation nodes call they look for the `upKeepNeeded` to return true
     * The following should be true in order to return true
     * 1. Time interval should have passed
     * 2. The lottery should have at least 1 player, and have some ETH
     * 3. Our subscription is funded with LINK
     * 4. The lottery should be in "open" state
     */
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        bool isOpen = (s_lotteryState == LotteryState.OPEN);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = isOpen && timePassed && hasPlayers && hasBalance;
    }

    // this function is called by the Chainlink Keeper
    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upKeepNeeded, ) = checkUpkeep("");
        if (!upKeepNeeded) {
            revert Lottery__UpKeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_lotteryState)
            );
        }
        s_lotteryState = LotteryState.CALCULATING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash, // gas lane
            s_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedLotteryWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /*_requestId */,
        uint256[] memory _randomWords
    ) internal override {
        uint256 indexOfWinner = _randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_lotteryState = LotteryState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");

        if (!success) {
            revert Lottery__WithDrawlError();
        }
        emit WinnerPicked(recentWinner);
    }

    /* View / Pure functions */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }
    function getPlayer(uint256 _index) public view returns (address) {
        return s_players[_index];
    }
    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getLotteryState() public view returns (LotteryState) {
        return s_lotteryState;
    }
    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }
    function getLatestTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }
    function getRequestConfirmations() public pure returns (uint16) {
        return REQUEST_CONFIRMATIONS;
    }
    function getNumWords() public pure returns (uint32) {
        return NUM_WORDS;
    }
    function getInterval() public view returns (uint256) {
        return i_interval;
    }
}

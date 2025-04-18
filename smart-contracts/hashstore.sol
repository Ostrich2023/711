//SPDX-License-Identifier: NOLICENSED
//Firstlane reference is the cervecation
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/access/AccessControl.sol";

///@dev oz管理三种登录
contract HashStorage is AccessControl {
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");
    bytes32 public constant SCHOOL_ROLE  = keccak256("SCHOOL_ROLE");
    bytes32 public constant COMPANY_ROLE = keccak256("COMPANY_ROLE");

    ///@dev 触发新的哈西值
    event HashStored(address indexed user, bytes32 hashValue);

    ///@dev 存储所有用户所有哈希
    mapping(address => bytes32[]) private userHashes;

    ///@dev DEFAULT_ADMIN_ROLE 分配
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    ///@notice 只有STUDENT_ROLE的账户才能存储哈希
    function storeHash(bytes32 hashValue)
        external
        onlyRole(STUDENT_ROLE)
    {
        userHashes[msg.sender].push(hashValue);
        emit HashStored(msg.sender, hashValue);
    }

    ///@notice 都可以查询
    function getHashes(address user)
        external
        view
        returns (bytes32[] memory)
    {
        require(
            msg.sender == user ||
            hasRole(SCHOOL_ROLE, msg.sender) ||
            hasRole(COMPANY_ROLE, msg.sender),
            "HashStorage: access denied"
        );
        return userHashes[user];
    }
}

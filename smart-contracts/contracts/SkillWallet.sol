// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SkillWallet {
    struct Skill {
        string name;
        string ipfsProof;
        address verifier;
        uint256 verifiedAt;
    }

    mapping(address => Skill[]) public skills;

    function addSkill(string memory name, string memory ipfsProof) public {
        skills[msg.sender].push(Skill(name, ipfsProof, msg.sender, block.timestamp));
    }

    function getSkills(address user) public view returns (Skill[] memory) {
        return skills[user];
    }
}

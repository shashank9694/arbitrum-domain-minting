// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FamDomainRegistry {
    address public admin;
    uint256 public domainPrice = 0.000001 ether; // Price for minting a domain
    mapping(string => address) public domainOwners; // Mapping of domain names to wallet addresses

    event DomainMinted(address indexed owner, string domainName);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Check if the domain already exists
    function checkDomainExists(string memory domainName) public view returns (bool) {
        return domainOwners[domainName] != address(0);
    }

    // Mint a domain for the sender
    function mintDomain(address newuser,  string memory domainName) public payable {
        require(!checkDomainExists(domainName), "Domain already exists.");
        // require(msg.value >= domainPrice, "Insufficient payment for minting the domain.");

        // Assign the domain to the sender
        domainOwners[domainName] = newuser;

        emit DomainMinted(newuser, domainName);
    }

    // Allow admin to update domain price
    function updateDomainPrice(uint256 newPrice) external onlyAdmin {
        domainPrice = newPrice;
    }

    // Allow admin to withdraw contract funds
    function withdraw() external onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }

    // Fallback function to receive ETH
    receive() external payable {}
}

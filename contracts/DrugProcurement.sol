// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DrugProcurement {
    address public owner;
    uint public totalDrugs;
    uint public totalPurchases;

    enum DrugStatus { ForSale, NotForSale }

    struct Drug {
        uint id;
        string name;
        string expiry;
        uint quantity;
        uint price;
        address supplier;
        DrugStatus status;
    }

    struct Purchase {
        uint drugId;
        uint quantity;
        address buyer;
    }

    mapping(uint => Drug) public drugs;
    mapping(address => uint[]) public supplierDrugs;
    mapping(uint => Purchase) public purchases;
    mapping(address => uint[]) public userPurchases;

    event DrugAdded(uint drugId, string name, uint quantity, uint price, address supplier);
    event DrugStatusUpdated(uint drugId, DrugStatus status);
    event DrugPurchased(uint purchaseId, uint drugId, uint quantity, address buyer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
        totalDrugs = 0;
        totalPurchases = 0;
    }

    function addDrug(string memory _name,string memory _expiry, uint _quantity, uint _price) external {
        require(_quantity > 0, "Quantity must be greater than 0");
        require(_price > 0, "Price must be greater than 0");

        totalDrugs++;
        Drug storage existingDrug = drugs[totalDrugs];
        existingDrug.id = totalDrugs; // Set the ID
        existingDrug.name = _name;
        existingDrug.expiry = _expiry;
        existingDrug.quantity += _quantity;
        existingDrug.price = _price;
        existingDrug.supplier = msg.sender;
        existingDrug.status = DrugStatus.ForSale;

        supplierDrugs[msg.sender].push(totalDrugs);

        emit DrugAdded(totalDrugs, _name, _quantity, _price, msg.sender);
    }

    function toggleDrugStatus(uint _drugId) external onlyOwner {
        require(_drugId <= totalDrugs, "Invalid drug ID");

        Drug storage drugToUpdate = drugs[_drugId];

        if (drugToUpdate.status == DrugStatus.ForSale) {
            drugToUpdate.status = DrugStatus.NotForSale;
        } else if (drugToUpdate.status == DrugStatus.NotForSale) {
            drugToUpdate.status = DrugStatus.ForSale;
        }

        emit DrugStatusUpdated(_drugId, drugToUpdate.status);
    }

    function buyDrug(uint _drugId, uint _quantity) external payable {
        require(_quantity > 0, "Quantity must be greater than 0");
        require(_drugId <= totalDrugs, "Invalid drug ID");

        Drug storage drugToBuy = drugs[_drugId];
        require(drugToBuy.status == DrugStatus.ForSale, "Drug is not for sale");
        require(drugToBuy.quantity >= _quantity, "Insufficient quantity available");
        require(msg.value == _quantity * drugToBuy.price, "Incorrect payment amount");

        totalPurchases++;
        Purchase storage newPurchase = purchases[totalPurchases];
        newPurchase.drugId = _drugId;
        newPurchase.quantity = _quantity;
        newPurchase.buyer = msg.sender;

        drugToBuy.quantity -= _quantity;
        userPurchases[msg.sender].push(totalPurchases);

        payable(drugToBuy.supplier).transfer(msg.value); // Send payment to the supplier

        emit DrugPurchased(totalPurchases, _drugId, _quantity, msg.sender);
    }

    function updateDrugQuantity(uint _drugId, uint _newQuantity) external onlyOwner {
        require(_drugId <= totalDrugs, "Invalid drug ID");

        Drug storage drugToUpdate = drugs[_drugId];
        require(drugToUpdate.status == DrugStatus.ForSale, "Cannot update quantity for a drug not for sale");

        drugToUpdate.quantity = _newQuantity;
    }

    function getUserPurchases(address _user) external view returns (uint[] memory) {
        return userPurchases[_user];
    }

    function getUserSupplies(address _user) external view returns (uint[] memory) {
        return supplierDrugs[_user];
    }
}

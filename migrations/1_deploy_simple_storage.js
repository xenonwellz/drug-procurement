const DrugProcurement = artifacts.require("DrugProcurement");

module.exports = function (deployer) {
  deployer.deploy(DrugProcurement);
};

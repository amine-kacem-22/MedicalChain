var receptionist = artifacts.require("./Receptionist.sol");

module.exports = function(deployer) {
  deployer.deploy(receptionist);
};
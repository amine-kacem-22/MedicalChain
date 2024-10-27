var admin = artifacts.require("./Administrator.sol");

module.exports = function(deployer) {
  deployer.deploy(admin);
};
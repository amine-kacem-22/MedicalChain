var director = artifacts.require("./Director.sol");

module.exports = function(deployer) {
  deployer.deploy(director);
};
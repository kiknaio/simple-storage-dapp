const SimpleStorage = artifacts.require('SimpleStore');

module.exports = async function(deployer, network, accounts) {
  // Deploy Simple Storage
  await deployer.deploy(SimpleStorage);
  const simpleStorage = await SimpleStorage.deployed();

  // Save simple text
  await simpleStorage.updateSimpleStorage("Simple text in simple storage");
}

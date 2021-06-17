const SimpleStorage = artifacts.require('SimpleStorage')

module.exports = async callback => {
  const simpleStorage = await SimpleStorage.deployed();
  await simpleStorage.getSimpleStorageValue();
  
  // Rest of the bootstrapper code goes here

  console.log("SimpleStorage deployed!");
  callback()
}

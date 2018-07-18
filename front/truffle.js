var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "reopen notice sorry void trend year artwork acquire accident diet accident hospital";

module.exports = {
  networks: {
    /*development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },*/
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/OsFryRDwcJ31gBH8zBLb", 0);
      }, 
      network_id: 3,
      gas: 4612388,
      gasprise: 22000000000
    }
  }
};

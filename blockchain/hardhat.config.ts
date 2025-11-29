import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    // Internal test network
    hardhat: {
      chainId: 1337,
    },
    // External local testnet (for your Backend to connect to)
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
  },
};

export default config;
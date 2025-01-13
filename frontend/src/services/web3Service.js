import { ethers } from 'ethers';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.wagerContract = null;
    this.contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  }

  async initialize() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask to use this application');
    }

    try {
      // Connect to provider
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get signer
      this.signer = await this.provider.getSigner();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      throw error;
    }
  }

  async getAccount() {
    try {
      if (!this.provider) await this.initialize();
      const accounts = await this.provider.send("eth_requestAccounts", []);
      return accounts[0];
    } catch (error) {
      console.error('Failed to get account:', error);
      throw error;
    }
  }

  async getBalance(address) {
    try {
      if (!this.provider) await this.initialize();
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  async sendTransaction(to, amount) {
    try {
      if (!this.signer) await this.initialize();
      const tx = await this.signer.sendTransaction({
        to,
        value: ethers.parseEther(amount.toString())
      });
      return await tx.wait();
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  // Function to check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
  }

  // Function to check if user is connected
  async isConnected() {
    try {
      if (!this.provider) return false;
      const accounts = await this.provider.listAccounts();
      return accounts.length > 0;
    } catch (error) {
      console.error('Failed to check connection:', error);
      return false;
    }
  }

  // Listen for account changes
  onAccountsChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  // Listen for chain changes
  onChainChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  // Remove listeners
  removeListeners() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  }
}

export default new Web3Service();

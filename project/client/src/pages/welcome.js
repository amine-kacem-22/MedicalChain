import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import AdminJSON from '../contracts/Administrator.json';

const Welcome = () => {
  const [web3, setWeb3] = useState(null);
  const [adminAddress, setAdminAddress] = useState('');
  const [connectedAccount, setConnectedAccount] = useState('');
  const [verificationResult, setVerificationResult] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        setWeb3(window.web3);
      } else {
        console.error('MetaMask not detected');
      }
    };
    initWeb3();
  }, []);

  useEffect(() => {
    const fetchAdminAddress = async () => {
      if (web3) {
        try {
          const adminContract = new web3.eth.Contract(AdminJSON.abi, '0x15B3EC50d9621E4B64aC798d7d4560b2816FA5cc');
          const address = await adminContract.methods.getAdmin().call();
          setAdminAddress(address);
        } catch (error) {
          console.error('Error fetching admin address:', error);
        }
      }
    };
    fetchAdminAddress();
  }, [web3]);

  useEffect(() => {
    if (web3) {
      web3.eth.getAccounts().then(accounts => {
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
        }
      });
    }
  }, [web3]);




  useEffect(() => {
    if (web3) {
      // Event handler for when MetaMask accounts change
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
        }
      };
  
      // Event handler for when MetaMask network changes
      const handleNetworkChanged = (networkId) => {
        // Handle network changes if necessary
      };
  
      // Attach event listeners for account and network changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('networkChanged', handleNetworkChanged);
  
      // Detach event listeners when the component is unmounted
      return () => {
        window.ethereum.off('accountsChanged', handleAccountsChanged);
        window.ethereum.off('networkChanged', handleNetworkChanged);
      };
    }
  }, [web3]);
  





  const verifyAccount = () => {
    if (adminAddress.toLowerCase() === connectedAccount.toLowerCase()) {
      setVerificationResult('Account verified as admin');
      // Redirect or perform other actions as needed
    } else {
      setVerificationResult('Account does not match admin address');
    }
  };

  return (
    <div>
      <h1>Welcome to Medical Chain</h1>
      <p>Connected Account: {connectedAccount}</p>
      <p>Admin Address: {adminAddress}</p>
      <button onClick={verifyAccount}>Verify Account</button>
      <p>{verificationResult}</p>
    </div>
  );
};

export default Welcome;

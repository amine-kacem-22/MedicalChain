import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import DirectorJSON from '../contracts/Director.json';
import AdminJSON from '../contracts/Administrator.json';

import './MyProfile.css';






const Myprofile = () => {
  
  
  const [web3, setWeb3] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [doctor, setDoctor] = useState(null);
  const[adminContract, setAdminContract] = useState(null);
  const[directorContract, setDirectorContract] = useState(null);

  
  


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
      const _dircetorContract = new web3.eth.Contract(DirectorJSON.abi, '0x0774B2bC0445a3e78D994E2461b839bb9321597B');
      setDirectorContract(_dircetorContract);

    }
  }, [web3]);


  useEffect(() => {
    if (web3) {
      const _adminContract = new web3.eth.Contract(AdminJSON.abi, '0xa67aDC269aD324b97a4bEa5804d0fB8a2375A81B');
      setAdminContract(_adminContract);

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
  
  
  
  
  
  useEffect(() => {
    if(connectedAccount && directorContract){
        const fetchDoctor = async () => {
            const doctor = await directorContract.methods.getDoctor(connectedAccount).call();
            setDoctor(doctor);
        };
        fetchDoctor();
    }
  }, [connectedAccount, directorContract]);

  const getHospitalName = async () => {
    if(adminContract && doctor.hospital_id && doctor){
        const hospital = await adminContract.methods.getHospital(doctor.hospital_id).call();
        const name = hospital.name;
        return name;
    }
    return '';
  }




  return (
    <div className="container">
      <div className="form">
        <h2>Personal Information</h2>
        <div>
          <p>ID: {doctor ? doctor.id : ''}</p>
          <p>Name: {doctor ? doctor.name : ''}</p>
          <p>Address: {doctor ? doctor.walletAddress : ''}</p>
          <p>Specialty: {doctor ? doctor.specialty : ''}</p>
          <p>Hospital: {doctor && adminContract ? getHospitalName() : ''}</p>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;

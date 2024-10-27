import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ReceptionistJSON from '../contracts/Receptionist.json';
import DirectorJSON from '../contracts/Director.json';

import './RequestsReceived.css';






const RequestsReceived = () => {
  
  
  const [web3, setWeb3] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [receptionistContract, setReceptionistContract] = useState(null);
  const [directorContract, setDirectorContract] = useState(null);
  const [patientsRequests, setPatientsRequests] = useState([]);

  
  


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
      const _receptionistContract = new web3.eth.Contract(ReceptionistJSON.abi, '0xa67aDC269aD324b97a4bEa5804d0fB8a2375A81B');
      setReceptionistContract(_receptionistContract);

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



  useEffect(() => {
    const fetchPatientsRequests = async () => {
      const patientsAddresses = await doctor.patientsRequests;
      const patients = await receptionistContract.methods.getPatientsList(patientsAddresses);
      setPatientsRequests(patients);
    };

    fetchPatientsRequests();
  }, [doctor]);


  

  

  // Function to handle accepting a request
  const handleAccept = async (address) => {
    await receptionistContract.methods.gotAccepted(address, doctor.walletAddress).send({ from: connectedAccount });
    await directorContract.methods.Accept(doctor.walletAddress, address).send({ from: connectedAccount });
    // You might want to refresh the requests after accepting
  };

  // Function to handle rejecting a request
  const handleReject = async (address) => {
    await receptionistContract.methods.gotRejected(address, connectedAccount).send({ from: connectedAccount });
    await directorContract.methods.Reject(connectedAccount, address).send({ from: connectedAccount });
  };

  




 

  
  




  return (
    <div className="received-requests">
      <h2 className="heading">Requests Received</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {patientsRequests.map(patient => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.gender}</td>
              <td>{patient.age}</td>
              <td>
                <button className="accept-button" onClick={() => { handleAccept(patient.patientWallet); }}>Accept</button>
                <button className="reject-button" onClick={() => { handleReject(patient.patientWallet); }}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsReceived;

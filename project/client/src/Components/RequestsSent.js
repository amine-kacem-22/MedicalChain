import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ReceptionistJSON from '../contracts/Receptionist.json';
import DirectorJSON from '../contracts/Director.json';

import './RequestsSent.css';






const Requests = () => {
  
  
  const [web3, setWeb3] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [receptionistContract, setReceptionistContract] = useState(null);
  const [directorContract, setDirectorContract] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);

  
  


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
    const fetchPendingRequests = async () => {
      const patientsAddresses = await doctor.pendingRequests;
      const patients = await receptionistContract.methods.getPatientsList(patientsAddresses);
      setPendingRequests(patients);
    };

    fetchPendingRequests();
  }, [doctor]);

 





  return (
    <div className="sent-requests">
        <h2 className="heading">Requests Sent</h2>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {pendingRequests.map(patient => (
                <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.gender}</td>
                <td>{patient.age}</td>
                <td>
                    <button onClick={() => {
                        directorContract.methods.doctorWithdrew(connectedAccount, patient.patientWallet).send({ from: connectedAccount });
                        receptionistContract.methods.doctorWithdrew(connectedAccount, patient.patientWallet).send({ from: connectedAccount });
                    }}>Cancel</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>    
  );
};

export default Requests;

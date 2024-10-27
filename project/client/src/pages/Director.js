import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import DirectorJSON from '../contracts/Director.json';
import './Director.css';

//import Web3 from 'web3';

import AdminJSON from '../contracts/Administrator.json';  // Import ABI from JSON file

//const abi = AdminJSON.abi;


//const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545'); // Use MetaMask provider or local node
//const contractAddress = '0xEBa2b4aB376d1d31CD5960a518Ff9EC8A9E03CFf'; // Your smart contract address

//const Admin = new web3.eth.Contract(abi, contractAddress);





const DoctorsList = () => {
  const [web3, setWeb3] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState('');


  
  const [doctors, setDoctors] = useState([]);
  const [newDoctorData, setNewDoctorData] = useState({
    doctorName: '',
    specialty: '',
    Age: '',
    doctorAddress: ''
  });
  const [receptionists, setReceptionists] = useState([]);
  const [newReceptionistData, setNewReceptionistlData] = useState({
    receptionistName: '',
    receptionistAddress: ''
  });

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
      setDirectorContract(_dircetorContract)

    }
  }, [web3]);


  useEffect(() => {
    if (web3) {
      const _adminContract = new web3.eth.Contract(AdminJSON.abi, '0xa67aDC269aD324b97a4bEa5804d0fB8a2375A81B');
      setAdminContract(_adminContract)

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
    const fetchDoctors = async () => {
      const doctors = await directorContract.methods.getDoctors(connectedAccount).call();
      setDoctors(doctors);
    };

    fetchDoctors();
  }, [web3]);

  const handleInputChange = (event) => {   // data to add new doctor
    const { name, value } = event.target;
    setNewDoctorData({ ...newDoctorData, [name]: value });
  };

  

  const addDoctor = async () => {
    try {
      if (!connectedAccount) {
        console.error('Director address is not available');
        return;
      }
      const director = await adminContract.methods.getDirector(connectedAccount).call();
      const hospitalId = director.hospital_id;
      await directorContract.methods.addDoctor(
        newDoctorData.doctorAddress,
        newDoctorData.doctorName,
        newDoctorData.specialty,
        newDoctorData.Age,
        hospitalId
      ).send({ from: connectedAccount });

      // After adding the hospital, fetch the updated list of hospitals
      const updatedDoctors = await directorContract.methods.getDoctors(connectedAccount).call();
      setDoctors(updatedDoctors);

      // Clear the form fields
      setNewDoctorData({
        doctorName: '',
        specialty: '',
        Age: '',
        doctorAddress: ''
      });
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  const addReceptionist = async () => {
    try {
      if (!connectedAccount) {
        console.error('Director address is not available');
        return;
      }
      const director = await adminContract.methods.getDirector(connectedAccount).call();
      const hospitalId = director.hospital_id;
      await directorContract.methods.addReceptionist(
        newReceptionistData.receptionistAddress,
        newReceptionistData.receptionistName,
        hospitalId
      ).send({ from: connectedAccount });

      // After adding the receptionist, fetch the updated list of receptionists
      const updatedReceptionists = await directorContract.methods.getReceptionists(connectedAccount).call();
      setReceptionists(updatedReceptionists);

      // Clear the form fields
      setNewReceptionistlData({
        receptionistName:'',
        receptionistAddress:''
      });
    } catch (error) {
      console.error('Error adding receptionist:', error);
    }
  };

  return (
    <div className="doctor-list-container">
      
      <div className="form-container">
        <h2 className="form-heading">Fill This Form To Add a New Doctor!</h2>
        <form className="doctor-form">
          <label>
            Address:
            <input
              type="text"
              name="doctorAddress"
              value={newDoctorData.doctorAddress}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Name:
            <input
              type="text"
              name="doctorName"
              value={newDoctorData.doctorName}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Specialty:
            <input
              type="text"
              name="specialty"
              value={newDoctorData.specialty}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Age:
            <input
              type="text"
              name="Age"
              value={newDoctorData.Age}
              onChange={handleInputChange}
            />
          </label>
          <br />
      
          <button type="button" onClick={addDoctor}>
            Add New Doctor
          </button>
        </form>
      </div>
      
      <div className="doctors-list">
        <h2>List of Doctors</h2>
        <ul className='doctor-table'>
          <li className="doctor-header">
            <span>Address</span>
            <span>Name</span>
            <span>Specialty</span>
            <span>Age</span>
          </li>
          {doctors.map((doctor, index) => (
            <li key={index} className='doctor-row'>
              <span>{doctor.walletAddress}</span>
              <span>{doctor.name}</span>
              <span>{doctor.specialty}</span>
              <span>{doctor.age}</span>
              
              
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default DoctorsList;

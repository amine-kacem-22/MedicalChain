import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import AdminJSON from '../contracts/Administrator.json';
import './Admin.css';






const web3 = new Web3('http://localhost:7545');
const adminContract = new web3.eth.Contract(AdminJSON.abi,'0x24DaD95D653beC627130471CF8bCf64d4435D60E');
const adminAddress = await adminContract.methods.getAdmin().call();
console.log("admin address : ",adminAddress);


const HospitalList = () => {

  const [connectedAccount, setConnectedAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [adminContract, setAdminContract] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newHospitalData, setNewHospitalData] = useState({
    name: '',
    location: '',
    directorName: '',
    directorAddress: ''
  });
  const [replacementData, setReplacementData] = useState({
    newDirectorName: '',
    newDirectorAddress: ''
  });



  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const defaultAccount = accounts[0];
          setCurrentAccount(defaultAccount);

          // Instantiate contract
          const contractAddress = '0x24DaD95D653beC627130471CF8bCf64d4435D60E'; 
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.log('MetaMask is not installed');
      }
    }

    init();
  }, []);



 




  useEffect(() => {
    if (web3) {
      web3.eth.getAccounts().then(accounts => {
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
          console.log("connected account : ",connectedAccount);
          setIsAdmin(adminAddress === connectedAccount);
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
          console.log("connected account : ",connectedAccount);
          setIsAdmin(adminAddress === connectedAccount);
        }
      };
  
     
  
      // Attach event listeners for account and network changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
  
      // Detach event listeners when the component is unmounted
      return () => {
        window.ethereum.off('accountsChanged', handleAccountsChanged);
      };
    }
  }, [web3]);
  
  
  
  
  
  


  useEffect(() => {
    const fetchHospitals = async () => {
      const hospitals = await adminContract.methods.getHospitals().call();
      setHospitals(hospitals);
    };

    fetchHospitals();
  }, [web3]);

  const handleInputChange = (event) => {   // data to add new hospital
    const { name, value } = event.target;
    setNewHospitalData({ ...newHospitalData, [name]: value });
  };

  const handleReplacementInputChange = (event) => {   //data to replace a director
    const { name, value } = event.target;
    setReplacementData({ ...replacementData, [name]: value });
  };

  const addHospital = async () => {
    try {
      if (!adminAddress) {
        console.error('Admin address is not available');
        return;
      }
      await adminContract.methods.addHospital(
        newHospitalData.name,
        newHospitalData.location,
        newHospitalData.directorAddress,
        newHospitalData.directorName
      ).send({ from: adminAddress });

      // After adding the hospital, fetch the updated list of hospitals
      const updatedHospitals = await adminContract.methods.getHospitals().call();
      setHospitals(updatedHospitals);

      // Clear the form fields
      setNewHospitalData({
        name: '',
        location: '',
        directorName: '',
        directorAddress: ''
      });
    } catch (error) {
      console.error('Error adding hospital:', error);
    }
  };

  const replaceDirector = async (hospitalId, newDirectorName, newDirectorAddress) => {
    try {
      await adminContract.methods.replaceDirector(
        hospitalId,
        newDirectorName,
        newDirectorAddress
      ).send({ from: adminAddress });

      // After replacing the director, fetch the updated list of hospitals
      const updatedHospitals = await adminContract.methods.getHospitals().call();
      setHospitals(updatedHospitals);
    } catch (error) {
      console.error('Error replacing director:', error);
    }
  };

  if (!isAdmin) {
    return <div>You are not authorized to access this page.</div>;
  }

  

  return (
    <div className="hospital-list-container">
      
      <div className="form-container">
        <h2 className="form-heading">Fill This Form To Add a New Hospital!</h2>
        <form className="hospital-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newHospitalData.name}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={newHospitalData.location}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Director Name:
            <input
              type="text"
              name="directorName"
              value={newHospitalData.directorName}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Director Address:
            <input
              type="text"
              name="directorAddress"
              value={newHospitalData.directorAddress}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <button type="button" onClick={addHospital}>
            Add New Hospital
          </button>
        </form>
      </div>
      
      <div className="hospitals-list">
        <h2>List of Hospitals</h2>
        <ul className='hospital-table'>
          <li className="hospital-header">
            <span>ID</span>
            <span>Name</span>
            <span>Location</span>
            <span>Director Address</span>
            <span>Director Name</span>
            <span>Replace Director</span>
          </li>
          {hospitals.map((hospital, index) => (
            <li key={index} className='hospital-row'>
              <span>{hospital.id}</span>
              <span>{hospital.name}</span>
              <span>{hospital.location}</span>
              <span>{hospital.directorAddress}</span>
              <span>{hospital.directorName}</span>
              <span>
                <form>
                  <label>
                    New Director Name:
                    <input
                      type="text"
                      name="newDirectorName"
                      value={replacementData.newDirectorName}
                      onChange={handleReplacementInputChange}
                    />
                  </label>
                  <br />
                  <label>
                    New Director Address:
                    <input
                      type="text"
                      name="newDirectorAddress"
                      value={replacementData.newDirectorAddress}
                      onChange={handleReplacementInputChange}
                    />
                  </label>
                  <br />
                  <button type="button" onClick={() => replaceDirector(hospital.id, replacementData.newDirectorName, replacementData.newDirectorAddress)}>
                    Replace
                  </button>
                </form>
              </span>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default HospitalList;

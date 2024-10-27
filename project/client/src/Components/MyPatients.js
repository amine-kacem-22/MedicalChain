import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ReceptionistJSON from '../contracts/Receptionist.json';
import DirectorJSON from '../contracts/Director.json';
import PrescriptionModal from '../Modals/AddPrescription';

import './MyPatients.css';






const MyPatients = () => {
  
  
  const [web3, setWeb3] = useState(null);
  const [myPatients, setMyPatients] = useState([]);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [receptionistContract, setReceptionistContract] = useState(null);
  const [searchedPatient, setSearchedPatient] = useState(null);
  const [directorContract, setDirectorContract] = useState(null);
  const [searchId, setSearchId] = useState('');
  
  


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
    const fetchMyPatients = async () => {
      const patientsAddresses = await doctor.patientsList;
      const patients = await receptionistContract.methods.getPatientsList(patientsAddresses);
      setMyPatients(patients);
    };

    fetchMyPatients();
  }, [web3]);

  const handleChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleSearch = async () => {
    if (!searchId) {
      alert('Please enter a valid patient ID.');
      return;
    }
    try {
      const id = parseInt(searchId);
      const patient = await receptionistContract.methods.Search(id).call();
      setSearchedPatient(patient);
    } catch (error) {
      console.error(error);
      setSearchedPatient(null);
      alert('Patient not found or invalid ID.');
    }
  };

  const renderSearchedPatient = () => {
    if (!searchedPatient) return null;
    return (
      <div>
        <h3>Search Result</h3>
        <p>ID: {searchedPatient.id}</p>
        <p>Name: {searchedPatient.name}</p>
      </div>
    );
  };

  const handleAddAppointmentsClick = (id) =>{

  };

  const handleViewAppointmentsClick = (id) =>{
    
  };

  const handleUploadMedicalRecordClick = (id) => {
    // Logic to view medical record
  };

  const handleViewMedicalRecordsClick = (id) => {
    // Logic to view medical record
  };
  

  const handleViewPrescriptionsClick = (id) => {
    // Logic to view medical record
  };

  const handleAddPrescriptionClick = (name) => {
    setSelectedPatient(name);
    setIsPrescriptionModalOpen(true);
  };



  const renderPatientList = () => {
    return (
      <div>
        <h3>Patients List</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Medical Records</th>
              <th>Prescriptions</th>
              <th>Appointments</th>
            </tr>
          </thead>
          <tbody>
            {myPatients.map((patient, index) => (
              <tr key={index}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>
                  <button onClick={() => handleViewMedicalRecordsClick(patient.id)}>View</button>
                  <button onClick={() => handleUploadMedicalRecordClick(patient.id)}>Upload</button>
                </td>
                <td>
                  <button onClick={() => handleViewPrescriptionsClick(patient.id)}>View</button>
                  <button onClick={() => handleAddPrescriptionClick(patient.name)}>Add</button>
                </td>
                <td>
                  <button onClick={() => handleViewAppointmentsClick(patient.id)}>View</button>
                  <button onClick={() => handleAddAppointmentsClick(patient.name)}>Add</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  
  





  return (
    <div className="container">
      <div className="patient-list">
        {renderPatientList()}
      </div>
      <div className="search-section">
        <h2>Search Patients</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Enter Patient ID"
          value={searchId}
          onChange={handleChange}
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
        {renderSearchedPatient()}
      </div>
      {isPrescriptionModalOpen && (
        <PrescriptionModal 
          onClose={() => setIsPrescriptionModalOpen(false)} 
          patient={selectedPatient}
          doctor={doctor}
        />
      )}
    </div>
  );
};

export default MyPatients;

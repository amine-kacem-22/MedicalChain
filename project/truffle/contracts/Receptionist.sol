// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
pragma experimental ABIEncoderV2;

contract Receptionist{

    struct Prescription{
        string from;
        string to;
        uint date;
        string medicines;
    }
    struct Patient{
        address patientWallet;
        string name;
        uint id;
        uint age;  
        string gender;
        address[] authorizedDoctors;
        address[] doctorsRequests; 
        address[] pendingRequests;
    }


    Patient[] Patients;
    mapping(address => Patient) patients;
    
    mapping (address => Prescription[]) prescriptions;





    

    // this is a helper function that removes an address from an array of addresses and returns the new array
    function removeAddressFromArray(address[] memory addressesArray, address addressToRemove) public pure returns (address[] memory) {
        uint length = addressesArray.length;
        uint indexToRemove = 0;
        bool found = false;

        // Find the index of the address to remove
        for (uint i = 0; i < length; i++) {
            if (addressesArray[i] == addressToRemove) {
                indexToRemove = i;
                found = true;
                break;
            }
        }

        // If the address is not found, return the original array
        if (!found) {
            return addressesArray;
        }

        // Create a new array to hold the result
        address[] memory newArray = new address[](length - 1);

        // Copy elements from the original array to the new array, excluding the address to remove
        for (uint i = 0; i < indexToRemove; i++) {
            newArray[i] = addressesArray[i];
        }
        for (uint i = indexToRemove + 1; i < length; i++) {
            newArray[i - 1] = addressesArray[i];
        }

        return newArray;
    }


    function setPrescription(address patientAddress, string memory _from, string memory _to, string memory _medicines) public{
        uint _date = block.timestamp;
        Prescription memory newPrescription = Prescription(_from, _to, _date, _medicines);
        prescriptions[patientAddress].push(newPrescription);
    }

    function getPrescriptions(address patientAddress) public view returns (Prescription[] memory){
        return prescriptions[patientAddress];
    }



    //function to add a new patient
    function addPatient(address _patientAddress, string memory _name, uint _age, string memory _gender) public {
        address[] memory _authorizedDoctors;
        address[] memory _doctorsRequests; 
        address[] memory _pendingRequests; 
        uint _id = Patients.length + 1; // first id will be 1
        Patient memory newPatient = Patient({
            patientWallet: _patientAddress,
            name: _name,
            id: _id,
            age: _age,
            gender: _gender,
            authorizedDoctors: _authorizedDoctors,
            doctorsRequests: _doctorsRequests,
            pendingRequests: _pendingRequests
        });
        patients[_patientAddress] = newPatient;
        Patients.push(newPatient);
    }

    function getPatient(address _patientAddress) public view returns(Patient memory){
        return(patients[_patientAddress]);
    }

    function isPatient(address _patientAddress) public view returns (bool){
        for(uint i=0; i<Patients.length; i++){
            if (Patients[i].patientWallet == _patientAddress){
                return true;
            }
        }
        return false;
    }


    modifier OnlyPatient(address _targetAddress){
        require(isPatient(_targetAddress),'User is not a patient!');
        _;
    }


    // function to get a patient by his id
    function Search(uint id) public view returns (Patient memory) {
        require(id > 0,'invalid ID');
        uint index = id-1;
        require(index < Patients.length, 'invalid ID');
        return Patients[index];
    }



    //function to get the array of patients from the array of their addresses
    function getPatientsList(address[] memory addressArray) public view returns(Patient[] memory){
        Patient[] memory patientsList = new Patient[](addressArray.length);
        for (uint i=0; i<addressArray.length; i++){
            patientsList[i] = patients[addressArray[i]];
        }
        return patientsList;
    }
    


    //function executes whenever a patient gets accepted by a doctor
    function gotAccepted(address patient, address doctor) public{
        patients[patient].authorizedDoctors.push(doctor);
        patients[patient].pendingRequests = removeAddressFromArray(patients[patient].pendingRequests, doctor);
    }


    function gotRejected(address patient, address doctor) public{
        patients[patient].pendingRequests = removeAddressFromArray(patients[patient].pendingRequests, doctor);
    }

    //function to execute when a doctor withdraws his request
    function doctorWithdrew(address doctor, address patient) public{
        patients[patient].doctorsRequests = removeAddressFromArray(patients[patient].doctorsRequests, doctor);
    }

    //function to execute when a doctor asks for permission
    function accessRequest(address _doctor, address _patient) public{
        patients[_patient].doctorsRequests.push(_doctor);
    }
    
}
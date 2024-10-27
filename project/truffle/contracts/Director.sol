// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
pragma experimental ABIEncoderV2;

//import "@openzeppelin/contracts/utils/Strings.sol";

contract Director{



    struct Doctor{
        uint id;
        address walletAddress;
        string name;
        string specialty;
        uint hospital_id;
        uint age;
        address[] pendingRequests;  // requests the doctor sent to patients
        address[] patientsList;
        address[] patientsRequests;   //requests recieved from patients
    }

    

    struct Receptionist{
        uint id;
        address receptionistWallet;
        string name;
        uint hospital_id;
    }

    




    mapping(address => Doctor[]) DirectorToDoctors;
    mapping(address => Receptionist[]) DirectorToReceptionists;

    mapping(address => mapping(address => Doctor)) directorToDoctors;
    mapping(address => mapping(address => Receptionist)) directorToReceptionists;

    mapping(address => Doctor) doctors;
    mapping(address => Receptionist) receptionists;

    address[] Doctors;
    address[] Receptionists;
    


    
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
    
    
    function isDoctor(address _target) public view returns (bool){
        for (uint i=0; i<Doctors.length; i++){
            if(Doctors[i] == _target){
                return true;
            }
        }
        return false;
    }

    function isReceptionist(address _target) public view returns (bool){
        for (uint i=0; i<Receptionists.length; i++){
            if(Receptionists[i] == _target){
                return true;
            }
        }
        return false;
    }


    modifier OnlyDoctors(address _directorAddress) {
        require(isDoctor(_directorAddress),"Caller should be a doctor!");
        _;
    }

    modifier OnlyReceptionnists(address _directorAddress) {
        require(isReceptionist(_directorAddress),"Caller should be a receptionnist!");
        _;
    }





     //                                      functions of the director


    
    //function to add a new doctor
    function addDoctor(address _walletAddress, string memory _name, string memory _specialty, uint _age, uint _hospital_id) public{
        address[] memory _pendingRequests;
        address[] memory _patientsList;
        address[] memory _patientsRequests;
        uint _id = Doctors.length+1;
        
        Doctor memory newDoctor = Doctor({
            id: _id,
            walletAddress: _walletAddress,
            name: _name,
            specialty: _specialty,
            hospital_id: _hospital_id,
            age: _age,
            pendingRequests: _pendingRequests,
            patientsList: _patientsList ,
            patientsRequests: _patientsRequests
        });

        DirectorToDoctors[msg.sender].push(newDoctor);  
        directorToDoctors[msg.sender][_walletAddress] = newDoctor;
        doctors[_walletAddress] = newDoctor;
        Doctors.push(_walletAddress);
    }


    //function to add a new receptionist
    function addReceptionist(address _walletAddress, string memory _name, uint _hospital_id) public{
        uint _id = Receptionists.length + 1;
        Receptionist memory newReceptionist = Receptionist(_id, _walletAddress, _name, _hospital_id);
        DirectorToReceptionists[msg.sender].push(newReceptionist);  
        directorToReceptionists[msg.sender][_walletAddress] = newReceptionist;
        receptionists[_walletAddress] = newReceptionist;
        Receptionists.push(_walletAddress);
    }



    //function to get the list of doctors
    function getDoctors(address _directorAddress) public view returns(Doctor[] memory){
            return DirectorToDoctors[_directorAddress];
        } 

    //function to get the list of receptionists
    function getReceptionists(address _directorAddress) public view returns(Receptionist[] memory){
        return DirectorToReceptionists[_directorAddress];
    }

    //function to get one doctor by his address and the address of his director
    function getDoctor(address _doctorAddress) public view returns(Doctor memory){
        return (doctors[_doctorAddress]);
    }

    //function to get one receptionist by his address and the address of his director
    function getReceptionist(address _receptionistAddress) public view returns(Receptionist memory){
        return (receptionists[_receptionistAddress]);
    } 


    function pending(address _doctorAddress, address _patientAddress) public view returns (bool){
        for (uint i=0; i<doctors[_doctorAddress].pendingRequests.length; i++){
            if(doctors[_doctorAddress].pendingRequests[i] == _patientAddress){
                return true;
            }
        }
        return false;
    }

    function received(address _doctorAddress, address _patientAddress) public view returns (bool){
        for (uint i=0; i<doctors[_doctorAddress].patientsRequests.length; i++){
            if(doctors[_doctorAddress].patientsRequests[i] == _patientAddress){
                return true;
            }
        }
        return false;
    }

    function isMyPatient(address _doctorAddress, address _patientAddress) public view returns (bool){
        for (uint i=0; i<doctors[_doctorAddress].patientsList.length; i++){
            if(doctors[_doctorAddress].patientsList[i] == _patientAddress){
                return true;
            }
        }
        return false;
    }

    //function to add patient to list of patients
    function acceptPatient (address doctor, address patient) public{
        doctors[doctor].patientsList.push(patient);
        doctors[doctor].patientsRequests = removeAddressFromArray(doctors[doctor].patientsRequests, patient);
    }

    // function to reject a request from a patient
    function rejectPatient(address doctor, address patient) public{
        doctors[doctor].patientsRequests = removeAddressFromArray(doctors[doctor].patientsRequests, patient);
    }

    //function to execute when a doctor withdraw a request
    function doctorWithdrew(address doctor, address patient) public{
        doctors[doctor].pendingRequests = removeAddressFromArray(doctors[doctor].pendingRequests, patient);
    }

    //function of doctor sending request
    function accessRequest(address _doctor, address _patient) public{
        doctors[_doctor].pendingRequests.push(_patient);
    }

    
}
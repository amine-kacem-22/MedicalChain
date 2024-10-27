// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
pragma experimental ABIEncoderV2;

contract Administrator{

    

    struct Hospital{
        uint id;
        string name;
        string location;
        address directorAddress;
        string directorName;
    }

    struct Director{
        string name;
        address walletAddress;
        uint hospital_id;  //0 if he is removed 
    }

    

    address admin; //supposed to be an employee in the health ministry
    
    address[] Directors;
    Hospital[] Hospitals;

    mapping(address => Director) directors;
    



    // constructor
    constructor() public {
        admin = msg.sender;
    }

    event DirectorReplaced(uint indexed hospitalID, address indexed oldDirector, address indexed newDirector);

    modifier OnlyAdmin() {
        require (msg.sender == admin,'Caller should be hospital director!');
        _;
    }
    

    function validHospitalID(uint _id) public view returns (bool){
        if (_id>0 && _id<=Hospitals.length){
            return true;
        }
        else{
            return false;
        }
    }

    // function to see if an address belongs to a director
    function isDirector(address _target) public view returns (bool) {
        for (uint i=0; i<Directors.length; i++){
            if(Directors[i] == _target && directors[Directors[i]].hospital_id>0){
                return true;
            }
        }
        return false;
    }


    
    //function to find director index in Directors given his address
    function directorIndex(address _director) public view returns(uint) {
        for (uint i=0; i<Directors.length; i++){
            if (Directors[i] == _director){
                return i;
            }
        }
        return Directors.length;
    }

    function getAdmin() public view returns (address){
        return admin;
    }

    
    
    
    //                      functions of the admin
    
    
    //function to replace a director with another one
    function replaceDirector(uint _id, string memory _name, address newDirectorAddress) public OnlyAdmin {
        require(validHospitalID(_id),"No registered hospital with the provided ID");
        address oldDirector = Hospitals[_id-1].directorAddress;  //save address of the ancient director for event emission
        uint index = directorIndex(oldDirector); //his index in the array of Directors
        Director memory newDirector = Director(_name, newDirectorAddress, _id); //instantiate the new director
        directors[newDirectorAddress] = newDirector; //add new director to the mapping of dircetors 
        Hospitals[_id-1].directorAddress = newDirectorAddress; //update the director address of the hospital
        Hospitals[_id-1].directorName = _name;
        directors[oldDirector].hospital_id = 0;  //set hospital ID of ancient director to 0 as he no longer works there
        Directors[index] = newDirectorAddress; //add the new director to the array
        
        emit DirectorReplaced(_id, oldDirector, newDirectorAddress); //emit the event of replacement
    }



    //event of hospital creation
    event createdHospital(string _name);



    //function to add a hospital and appoint a director to it
    function addHospital(string memory _name, string memory _location, address _directorAddress, string memory _directorName) public OnlyAdmin{
        Director memory newDirector = Director(_directorName, _directorAddress, Hospitals.length + 1);  //instantiate the new director
        directors[_directorAddress] = newDirector; //add the new director to the mapping of directors
        Directors.push (_directorAddress);
        Hospital memory newHospital = Hospital(Hospitals.length+1, _name, _location, _directorAddress, _directorName);   // instantiate the new hospital
        Hospitals.push(newHospital);
        emit createdHospital(_name);
    }


    //function to get the hospitals array
    function getHospitals() public view returns(Hospital[] memory){
        return Hospitals;
    } 

    function getHospital(uint _id) public view returns(Hospital memory){
        return Hospitals[_id - 1];
    }

    //function to get all the directors
    function getDirector(address _directorAddress) public view returns(Director memory){
        return directors[_directorAddress];
    }    
    
}



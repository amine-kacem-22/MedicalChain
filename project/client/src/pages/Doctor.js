import React from 'react';
import Sidebar from '../Components/Sidebar';
import MyProfile from '../Components/MyProfile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



const DoctorPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <Router>
            <Routes>
                <Route path='/myProfile' component={<MyProfile />}/>
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;

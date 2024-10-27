import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <ul className="list-unstyled components">
        <li>
          <a href="#myProfile">My Profile</a>
        </li>
        <li>
          <a href="#patients">List of Patients</a>
        </li>
        <li>
          <a href="#appointments">List of Appointments</a>
        </li>
        <li>
          <a href="#sentRequests">Requests Sent</a>
        </li>
        <li>
          <a href="#receivedRequests">Requests Received</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

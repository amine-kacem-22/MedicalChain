import React from 'react';

const PrescriptionModal = ({ onClose, patient, doctor }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add Prescription</h2>
        {/* Display patient and doctor information */}
        <p>Patient Name: {patient.name}</p>
        <p>Doctor Name: {doctor.name}</p>
        {/* Form for adding prescriptions */}
        <form>
          <label htmlFor="prescription">Prescription:</label>
          <textarea id="prescription" name="prescription"></textarea>
          <button type="submit">Confirm</button>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;


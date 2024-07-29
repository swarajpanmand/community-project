import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/RoadSafety.css';

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/complaints');
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setError('Failed to fetch complaints');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h2>Complaints List</h2>
      {complaints.map((complaint, index) => (
        <div key={index} className="complaint-item">
          <p>Date: {new Date(complaint.date).toLocaleString()}</p>
          <p>Location: Latitude: {complaint.location.coordinates[1]}, Longitude: {complaint.location.coordinates[0]}</p>
          <p>Complaint: {complaint.complaint}</p>
          <p>Plate Number: <span className="plate-number">{complaint.plateNumber}</span></p>
          {complaint.imageUrl && (
            <img src={`http://localhost:5000${complaint.imageUrl}`} alt="Complaint" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ComplaintsList;
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RoadSafety.css';

const LicensePlateReader = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('upload', file);

      setIsLoading(true);
      setError('');

      try {
        const response = await axios.post('http://localhost:5000/api/read-plate', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data && response.data.results && response.data.results.length > 0) {
          setPlateNumber(response.data.results[0].plate);
        } else {
          setError('No plate number found in the response');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <h2>License Plate Reader</h2>
      <div className="form-group">
        <label htmlFor="imageUpload">Upload an image:</label>
        <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      {imagePreview && (
        <div className="form-group">
          <h3>Uploaded Image:</h3>
          <img src={imagePreview} alt="Uploaded license plate" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </div>
      )}
      {isLoading ? (
        <p className="loading">Reading license plate...</p>
      ) : plateNumber ? (
        <p>License Plate: <span className="plate-number">{plateNumber}</span></p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : null}
    </div>
  );
};

export default LicensePlateReader;
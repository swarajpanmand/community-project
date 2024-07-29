import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/RoadSafety.css';

const ComplaintForm = () => {
  const [complaint, setComplaint] = useState('');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    } else {
      setError("Geolocation is not available in your browser.");
    }
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      await extractPlateNumber(file);
    }
  };

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => {
      setImage(blob);
      setImagePreview(canvas.toDataURL());
      await extractPlateNumber(blob);
    });
  };

  const extractPlateNumber = async (imageFile) => {
    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('upload', imageFile);

    try {
      const response = await axios.post('http://localhost:5000/api/read-plate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        setPlateNumber(response.data.results[0].plate);
      } else {
        setError('No plate number found in the image');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`Error extracting plate number: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('complaint', complaint);
    formData.append('latitude', location.latitude);
    formData.append('longitude', location.longitude);
    formData.append('date', new Date().toISOString());
    formData.append('plateNumber', plateNumber);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setComplaint('');
      setImage(null);
      setImagePreview(null);
      setPlateNumber('');
    } catch (error) {
      console.error('Error:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>File a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="complaint">Complaint:</label>
          <textarea
            id="complaint"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="Enter your complaint"
            required
          />
        </div>
        <div className="form-group">
          <p>Location: Latitude: {location.latitude}, Longitude: {location.longitude}</p>
        </div>
        <div className="form-group">
          <label htmlFor="imageUpload">Upload an image:</label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
        </div>
        <div className="form-group">
          <button type="button" onClick={startCamera}>Use Camera</button>
          <button type="button" onClick={handleCapture}>Capture Photo</button>
        </div>
        <video ref={videoRef} style={{ display: 'none' }} autoPlay />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {imagePreview && (
          <div className="form-group">
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </div>
        )}
        {plateNumber && <p>Detected Plate Number: <span className="plate-number">{plateNumber}</span></p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ComplaintForm;
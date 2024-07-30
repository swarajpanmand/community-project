import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import '../styles/RoadSafety.css';

const ComplaintForm = () => {
  const [complaint, setComplaint] = useState('');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const { getToken } = useAuth();

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

    return () => {
      stopCamera();
    };
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
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access the camera. Please ensure you've granted the necessary permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      canvas.toBlob(async (blob) => {
        if (blob) {
          setImage(blob);
          setImagePreview(canvas.toDataURL());
          await extractPlateNumber(blob);
        }
      }, 'image/jpeg');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint.trim()) {
      setError('Please enter a complaint before submitting.');
      return;
    }
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
      const token = await getToken();
      await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
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
    <div className="complaint-form">
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
          />
        </div>
        <div className="form-group camera-controls">
          {!stream ? (
            <button type="button" onClick={startCamera}>Start Camera</button>
          ) : (
            <>
              <button type="button" onClick={stopCamera}>Stop Camera</button>
              <button type="button" onClick={capturePhoto}>Capture Photo</button>
            </>
          )}
        </div>
        <div className="camera-preview">
          <video ref={videoRef} autoPlay playsInline />
        </div>
        {imagePreview && (
          <div className="form-group">
            <img src={imagePreview} alt="Preview" className="image-preview" />
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
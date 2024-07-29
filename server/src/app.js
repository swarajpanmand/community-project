const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/complaints_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Complaint Schema
const complaintSchema = new mongoose.Schema({
  complaint: String,
  location: {
    type: { type: String },
    coordinates: [Number]
  },
  date: Date,
  plateNumber: String,
  imageUrl: String
});

complaintSchema.index({ location: '2dsphere' });

const Complaint = mongoose.model('Complaint', complaintSchema);

app.post('/api/read-plate', upload.single('upload'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;
    const body = new FormData();
    body.append('upload', fs.createReadStream(imagePath));
    body.append('regions', 'in'); 

    const response = await fetch('https://api.platerecognizer.com/v1/plate-reader/', {
      method: 'POST',
      headers: {
        Authorization: 'Token afe042b0d1a25df562e59bce47ad1a9dddf171e7',
      },
      body: body,
    });

    const data = await response.json();

    // Delete the temporary file
    fs.unlinkSync(imagePath);

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/complaints', upload.single('image'), async (req, res) => {
  try {
    const { complaint, latitude, longitude, date, plateNumber } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newComplaint = new Complaint({
      complaint,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      date: new Date(date),
      plateNumber,
      imageUrl
    });

    await newComplaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully' });
  } catch (error) {
    console.error('Error saving complaint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ date: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
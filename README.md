


# Road Safety Complaint System

The Road Safety Complaint System is a web application that allows users to file complaints about road safety issues. Users can upload images, capture photos, and the system will automatically read license plates from the images using an external API. Complaints are then stored in a MongoDB database and can be viewed by all users.

## Features

- **License Plate Reader**: Upload or capture images to extract license plate numbers.
- **File a Complaint**: Submit a complaint with details, location, and images.
- **View Complaints**: View a list of submitted complaints with their details and images.
- **Geolocation**: Automatically fetch the user's current location for complaint submissions.

## Technology Stack

- *Frontend*: React, React Router
- **Backend**: Express.js, Multer, Mongoose
- **Database**: MongoDB
- **License Plate Recognition API**: Plate Recognizer API

## Installation

### Prerequisites

- Node.js
- MongoDB

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/swarajpanmand/community-project.git
   cd community-project
   ```

2. Install dependencies for both client and server:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Set up the MongoDB database. Make sure MongoDB is running and accessible on `mongodb://localhost:27017/complaints_db`.

4. Configure environment variables in the server:

   Create a `.env` file in the `server` directory with the following content:

   ```env
   MONGODB_URI=mongodb://localhost:27017/complaints_db
   PLATE_RECOGNIZER_API_KEY=your_plate_recognizer_api_key
   PORT=5000
   ```

5. Run the server:

   ```bash
   cd server
   npm start
   ```

6. Run the client:

   ```bash
   cd client
   npm run dev
   ```

   The application should now be running at `http://localhost:5173`.

## Usage

### License Plate Reader

1. Navigate to the "License Plate Reader" page.
2. Upload an image containing a license plate.
3. The system will read the plate number and display it on the screen.

### File a Complaint

1. Navigate to the "File a Complaint" page.
2. Fill out the complaint form.
3. Optionally, upload an image or capture a photo using the camera.
4. Submit the complaint.

### View Complaints

1. Navigate to the "View Complaints" page.
2. Browse through the list of submitted complaints.

## Directory Structure

```plaintext
road-safety-complaint-system/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ComplaintForm.jsx
│   │   │   ├── ComplaintsList.jsx
│   │   │   ├── LicensePlateReader.jsx
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
├── server/
│   ├── src/
│   │   ├── app.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
├── README.md
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.


## Acknowledgements

- [Plate Recognizer API](https://platerecognizer.com/)
- [React](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

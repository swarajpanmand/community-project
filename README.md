# Road Safety Complaint System

## Overview

The Road Safety Complaint System is a web application that allows users to file and view complaints about road safety issues. The app features a license plate reader, a complaint form, and a complaints list. The system ensures that only authenticated users can file and view complaints.

## Features

- **License Plate Reader:** Users can upload images of license plates, and the system will extract and display the plate number.
- **Complaint Form:** Authenticated users can file complaints, including uploading an image, capturing their current location, and auto-filling the license plate number.
- **Complaints List:** Authenticated users can view a list of all complaints, including the details and images.

## Technologies Used

- **Frontend:** React, React Router, Clerk for authentication, Axios for API requests.
- **Backend:** Node.js, Express, MongoDB, Mongoose, Multer for file uploads, Geolocation API.
- **License Plate Recognition:** Third-party API integration.

## Installation

### Prerequisites

- Node.js and npm
- MongoDB
- Clerk account

### Steps

1. **Clone the repository:**
   ```sh
   git clone https://github.com/swarajpanmand/community-project.git
   cd community-project
   ```

2. **Install dependencies:**

   - For the server:
     ```sh
     cd server
     npm install
     ```

   - For the client:
     ```sh
     cd client
     npm install
     ```

3. **Set up environment variables:**

   - Create a `.env` file in the `server` directory with the following content:
     ```
     PORT=5000
     MONGODB_URI=your-mongodb-uri
     CLERK_API_KEY=your-clerk-api-key
     CLERK_SECRET_KEY=your-clerk-secret-key
     ```

   - Create a `.env` file in the `client` directory with the following content:
     ```
     REACT_APP_CLERK_FRONTEND_API=your-clerk-frontend-api
     ```

4. **Start the server:**
   ```sh
   cd server
   npm start
   ```

5. **Start the client:**
   ```sh
   cd client
   npm run dev
   ```

6. **Open your browser and navigate to:**
   ```
   http://localhost:5173/
   ```

## Project Structure

```
road-safety-complaint-system/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── index.html
│   ├── package.json
│   └── .env
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── app.js
│   │   ├── config.js
│   ├── package.json
│   └── .env
├── README.md
└── .gitignore
```

## Usage

1. **Sign Up / Sign In:**
   - Use the Sign In page to create an account or log in.

2. **License Plate Reader:**
   - Upload an image of a license plate to extract and display the plate number.

3. **File a Complaint:**
   - Navigate to the "File a Complaint" page, fill out the form, upload an image, and submit.

4. **View Complaints:**
   - Navigate to the "View Complaints" page to see a list of all complaints filed.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.


## Acknowledgements

- Thanks to the Clerk team for the authentication solution.
- Thanks to the community for the continuous support and feedback.

---

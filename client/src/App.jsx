import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import LicensePlateReader from './components/LicensePlateReader'
import ComplaintForm from './components/ComplaintForm'
import ComplaintsList from './components/ComplaintsList'

const App = () => {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Road Safety Complaint System</h1>
        </header>
        <nav className="nav">
          <ul>
            <li><Link to="/">License Plate Reader</Link></li>
            <li><Link to="/complaint">File a Complaint</Link></li>
            <li><Link to="/complaints">View Complaints</Link></li>
          </ul>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<LicensePlateReader />} />
            <Route path="/complaint" element={<ComplaintForm />} />
            <Route path="/complaints" element={<ComplaintsList />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
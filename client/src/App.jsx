import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LicensePlateReader from './components/LicensePlateReader';
import ComplaintForm from './components/ComplaintForm';
import ComplaintsList from './components/ComplaintsList';
import SignInPage from './components/SignInPage';
import SignOutButton from './components/SignOut';

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
            <SignedIn>
              <li><Link to="/complaint">File a Complaint</Link></li>
              <li><Link to="/complaints">View Complaints</Link></li>
              <li><SignOutButton /></li>
            </SignedIn>
            <SignedOut>
              <li><Link to="/sign-in">Sign In</Link></li>
            </SignedOut>
          </ul>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<LicensePlateReader />} />
            <Route
              path="/complaint"
              element={
                <SignedIn>
                  <ComplaintForm />
                </SignedIn>
              }
            />
            <Route
              path="/complaints"
              element={
                <SignedIn>
                  <ComplaintsList />
                </SignedIn>
              }
            />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route
              path="/complaint"
              element={
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              }
            />
            <Route
              path="/complaints"
              element={
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut().then(() => {
      navigate('/');
    });
  };

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  );
}

export default SignOutButton;

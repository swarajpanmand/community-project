import React from 'react';
import ReactDOM from 'react-dom';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const clerkFrontendApi = "pk_test_cHJvdmVuLXRlcm1pdGUtMjMuY2xlcmsuYWNjb3VudHMuZGV2JA";

ReactDOM.render(
  <ClerkProvider publishableKey={clerkFrontendApi}>
      <App />
  </ClerkProvider>,
  document.getElementById('root')
);

import React from 'react';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import CredentialsHelper from './components/CredentialsHelper';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="bg-surface rounded-2xl shadow-elevation-2 p-8 border border-border">
            {/* Header Section */}
            <LoginHeader />
            
            {/* Login Form */}
            <LoginForm />
            
            {/* Demo Credentials Helper */}
            <CredentialsHelper />
            
            {/* Trust Signals */}
            <TrustSignals />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
import React from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const MetaMaskGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <img 
            src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" 
            alt="MetaMask Logo" 
            className="mx-auto h-24 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            MetaMask Required
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            To use our dApp, you'll need to install MetaMask - a secure wallet for Web3.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Why MetaMask?</h3>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Secure wallet for your crypto assets</li>
              <li>Required to interact with blockchain</li>
              <li>Industry standard for Web3 applications</li>
              <li>Easy to set up and use</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Installation Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Visit the official MetaMask website</li>
              <li>Click "Download" and select your browser</li>
              <li>Follow the installation wizard</li>
              <li>Create or import a wallet</li>
              <li>Return here and refresh the page</li>
            </ol>
          </div>

          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Install MetaMask
            <ArrowTopRightOnSquareIcon className="ml-2 -mr-1 h-4 w-4" />
          </a>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>
            After installation, please refresh this page.
            <button 
              onClick={() => window.location.reload()}
              className="ml-2 text-indigo-600 hover:text-indigo-500"
            >
              Refresh Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskGuide;

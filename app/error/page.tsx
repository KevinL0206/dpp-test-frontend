import React from 'react';

export default function ErrorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Error</h1>
      <p className="text-xl">
        We are sorry, but there was an error processing your request. 
        The product may not be authentic or there might have been an issue with our server.
      </p>
      <p className="mt-4">
        <a href="/" className="text-blue-500 hover:underline">Return to home page</a>
      </p>
    </div>
  );
}

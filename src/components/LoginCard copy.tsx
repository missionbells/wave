import React from "react";

export default function LoginCard() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 w-full max-w-md h-96 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-serif font-medium text-gray-900">
          Welcome back
        </h1>
        <p className="mt-3 text-gray-600 text-md font-sans">
          Stay ahead of the market with real-time data, smart insights, and the tools all in one place.
        </p>
        <button className="
        mt-6 flex items-center justify-center w-full border rounded-lg px-4 py-3 
        text-gray-900 shadow-sm hover:bg-gray-100 transition
        font-medium">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
            alt="Microsoft Logo" 
            className="w-5 h-5 mr-2"
          />
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
}
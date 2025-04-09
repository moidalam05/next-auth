"use client";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserProfile = ({ params }: any) => {
  const { id } = React.use(params);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">User ID: {id}</h1>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
      >
        Go Back to Profile
      </button>
    </div>
  );
};

export default UserProfile;

"use client";
import React from "react";

const UserProfile = ({ params }: any) => {
  const { id } = React.use(params);
  return (
    <div>
      <h1>Profile Page</h1>
      <p>This is the profile page.</p>
      <p>{id}</p>
    </div>
  );
};

export default UserProfile;

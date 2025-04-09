"use client";
import React from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();
  async function logout() {
    try {
      const response = await axios.get("/api/users/logout");
      console.log("Logout response: ", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/login");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Something went wrong: ", error);
      toast.error(error.message);
    }
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover"
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-6 flex-1">
          <h1 className="text-2xl font-bold">Salena Gomez</h1>
          <p className="text-gray-400">salenagomez@example.com</p>
          <p className="mt-2 text-gray-300">
            Welcome to your profile dashboard. Here you can manage your account
            and view your activity.
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-700 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <p className="text-gray-400 mt-2">No recent activity to display.</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Account Settings</h2>
          <p className="text-gray-400 mt-2">Manage your account preferences.</p>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg cursor-pointer shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

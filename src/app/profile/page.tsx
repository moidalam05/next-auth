"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProfilePage = () => {
  const router = useRouter();
  const [data, setData] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
    username: string;
    email: string;
  } | null>(null);
  async function logout() {
    try {
      const response = await axios.get("/api/users/logout");
      console.log("Logout response: ", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/login");
      } else {
        toast.error(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Something went wrong: ", error);
      toast.error(error.message);
    }
  }

  async function getUserDetails() {
    try {
      const response = await axios.get("/api/users/me");
      console.log("User details response: ", response.data);
      setData(response.data.data);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Something went wrong: ", error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
        <div className="flex flex-col md:flex-row items-center md:items-start"></div>
        <div className="mt-4 md:mt-0 md:ml-6 flex-1">
          <h1 className="text-2xl font-bold">
            {data?.username.toUpperCase() || "Guest"}
          </h1>
          <p className="text-gray-400">{data?.email || "No email available"}</p>
          <p className="mt-2">
            {data && (
              <>
                <span className="text-gray-400">User ID - </span>
                <Link
                  className="bg-green-800 p-1 rounded-md"
                  href={`/profile/${data._id}`}
                >
                  {data._id}
                </Link>
              </>
            )}
          </p>
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
      <div className="mt-6 flex justify-center gap-4">
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

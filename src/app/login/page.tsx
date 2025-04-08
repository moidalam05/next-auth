"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

const LoginPage = () => {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/login", user);
      console.log("response", response.data);
      if (response.data.success === true) {
        toast.success(response.data.message);
        router.push("/profile");
      } else {
        toast.error(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("login failed error", error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-white">
          Login to Your Account
        </h2>
        <form className="space-y-4" onSubmit={onLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
          >
            {buttonDisabled ? "Fill All Fields" : "Login"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

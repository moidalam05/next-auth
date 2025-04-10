/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = async () => {
    try {
      const response = await axios.post("/api/users/verifyemail", { token });
      console.log("Response:", response.data);

      if (response.data.success) {
        setVerified(true);
        toast.success(response.data.message);
      } else {
        setError(true);
        toast.error(response.data.message || "Verification failed.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(true);
      toast.error(err?.response?.data?.message || "Verification error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>

      {loading ? (
        <p className="text-lg">Verifying your email...</p>
      ) : verified ? (
        <div className="text-center">
          <p className="text-lg mb-4 text-green-400">
            Your email has been successfully verified!
          </p>
          <Link href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </Link>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">
            Failed to verify your email.
          </p>
        </div>
      ) : null}
    </div>
  );
}

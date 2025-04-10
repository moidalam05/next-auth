/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    if (!token) {
      return NextResponse.json(
        { message: "Token is required", success: false },
        { status: 400 }
      );
    }

    // Get only users who have a verifyToken and not yet verified
    const users = await User.find({
      verifyTokenExpiry: { $gt: Date.now() },
    });

    // Check each user's hashed token
    let matchedUser = null;

    for (const user of users) {
      const isMatch = await bcryptjs.compare(user._id.toString(), token);
      if (isMatch && user.verifyToken) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return NextResponse.json(
        { message: "Invalid or expired token", success: false },
        { status: 400 }
      );
    }

    matchedUser.isVarified = true;
    matchedUser.verifyToken = undefined;
    matchedUser.verifyTokenExpiry = undefined;
    await matchedUser.save();

    return NextResponse.json(
      { message: "Email verified successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

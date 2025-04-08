import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("Request body", reqBody);
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist!", success: false },
        { status: 400 }
      );
    }

    if (email !== user.email) {
      return NextResponse.json({
        message: "Email is incorrect",
        success: false,
      });
    }

    // Check if the password is correct
    const validatePassword = await bcryptjs.compare(password, user.password);
    if (!validatePassword) {
      return NextResponse.json({
        message: "Password is incorrect",
        success: false,
      });
    }

    // Generate a token for the user
    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    // create Token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // Set the token in the cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Something went wrong", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

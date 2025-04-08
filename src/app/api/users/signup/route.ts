import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("Request body", reqBody);
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password before saving it to the database
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User created successfully", savedUser);

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      user: savedUser,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Something went wrong", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      maxAge: -1,
    });

    return response;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Something went wrong: ", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER!,
        pass: process.env.MAILTRAP_PASS!,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #f9f9f9; color: #333;">
    <h2 style="text-align: center; color: #0070f3;">
      ${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}
    </h2>
    <p style="font-size: 16px;">
      ${
        emailType === "VERIFY"
          ? "Thank you for signing up! Please verify your email address by clicking the link below."
          : "We received a request to reset your password. You can reset it by clicking the link below."
      }
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${
        process.env.DOMAIN +
        (emailType === "VERIFY"
          ? "/verifyemail?token="
          : "/resetpassword?token=") +
        hashedToken
      }"
        style="display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #0070f3; border-radius: 6px; text-decoration: none;">
        ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
      </a>
    </div>
    <p style="font-size: 14px;">
      Or copy and paste the following link into your browser:
    </p>
    <p style="font-size: 14px; word-break: break-all; color: #555;">
      ${
        process.env.DOMAIN +
        (emailType === "VERIFY"
          ? "/verifyemail?token="
          : "/resetpassword?token=") +
        hashedToken
      }
    </p>
    <hr style="margin: 30px 0;" />
    <p style="font-size: 12px; text-align: center; color: #888;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>
`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    if (mailResponse.rejected.length > 0) {
      throw new Error("Email not sent");
    }
    console.log("Email sent successfully:", mailResponse.response);
    return mailResponse;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error sending email:", error);
    throw new Error(error.message);
  }
};

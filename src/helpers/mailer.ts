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
      html: `<p>${
        emailType === "VERIFY"
          ? "Please click the link below to verify your email address."
          : "Please click the link below to reset your password."
      }</p><a href="${
        process.env.DOMAIN +
        (emailType === "VERIFY" ? "/verify/" : "/reset/") +
        hashedToken
      }">Click here</a>`,
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

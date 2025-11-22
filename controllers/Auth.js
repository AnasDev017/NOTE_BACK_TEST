import UserModel from "../models/User.js";
import bycript from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../utils/SendEmail.js";
transporter.verify((err, success) => {
  if (err) console.log("SMTP Error:", err);
  else console.log("SMTP Ready");
});

const Register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res
        .status(303)
        .json({ success: true, message: " All faild are required" });
    }
    const ExiteingUser = await UserModel.findOne({ email });
    if (ExiteingUser) {
      return res
        .status(303)
        .json({ success: true, message: "User already exists" });
    }
    const hasePassword = await bycript.hashSync(password, 10);
    const NewUser = new UserModel({
      userName,
      email,
      password: hasePassword,
    });
    const sendMail = async()=>{
      const info = await transporter.sendMail({
        from: 'anastahirhussain7@gmail.com',
        to: NewUser.email,
        subject: "Wellcome!",
        html: `
        <div style="width:100%;background:#f5f5f5;padding:30px 0;font-family:Arial;">
          <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">
            
            <div style="background:#111827;padding:30px;color:#fff;text-align:center;">
              <h1 style="margin:0;font-size:28px;">
                Welcome to <span style="color:#60a5fa;">Digitix</span>!
              </h1>
            </div>
      
            <div style="padding:30px;color:#333;">
              <h2>Hey 👋</h2>
              <p style="line-height:1.6;font-size:15px;">
                We’re excited to have you on board!  
                Thanks for joining our platform — you're officially part of the family now 😎🔥
              </p>
      
              <p style="line-height:1.6;font-size:15px;">
                You’ll now get updates, new features and exclusive perks.
                If you ever need help, we’re just one reply away.
              </p>
      
              <a href="#" style="display:inline-block;margin-top:20px;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-size:15px;">
                Get Started
              </a>
            </div>
      
            <div style="padding:20px;background:#f3f4f6;color:#555;text-align:center;font-size:13px;">
              © 2025 Digitix. All rights reserved.
            </div>
      
          </div>
        </div>
      `      
      });
      console.log("Message sent:", info.messageId);
    }
    sendMail()
        await NewUser.save();
    res
      .status(200)
      .json({
        success: true,
        message: "User Register Successfully",
        user: NewUser,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: true, message: " Internal server error" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(303)
        .json({ success: true, message: " All faild are required" });
    }
    const FindeUser = await UserModel.findOne({ email });
    if (!FindeUser) {
      return res
        .status(404)
        .json({ success: false, message: " User Not Found" });
    }
    const CheckPassword = await bycript.compare(password, FindeUser.password);
    if (!CheckPassword) {
      return res
        .status(404)
        .json({ success: true, message: " Invalid Password" });
    }
    const token = await jwt.sign(
      { userId: FindeUser._id },
      process.env.SecriteKey,
      { expiresIn: "3d" }
    );

    // Cookie options: in production (cross-site) we must set SameSite='none' and secure=true
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd, // true in production (HTTPS)
      maxAge: 3 * 24 * 3600 * 1000,
    };
    if (isProd) {
      // required for cross-site cookies in browsers
      cookieOptions.sameSite = "none";
    } else {
      cookieOptions.sameSite = "lax";
    }

    res.cookie("token", token, cookieOptions);
    res
      .status(200)
      .json({
        success: true,
        message: "user login successfully",
        user: FindeUser,
        token,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: true, message: " Internal server error" });
  }
};

const Logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const clearOptions = { httpOnly: true };
    if (isProd) {
      clearOptions.sameSite = "none";
      clearOptions.secure = true;
    } else {
      clearOptions.sameSite = "lax";
    }
    res.clearCookie("token", clearOptions);
    return res
      .status(200)
      .json({ success: true, message: " Log out Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: true, message: " Internal server error" });
  }
};
const isLogin = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(200)
        .json({
          success: false,
          message: "User Not Logind",
          user,
          isLoggedIn: false,
        });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "User is Login",
        user,
        isLoggedIn: true,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: true,
        message: " Internal server error",
        isLoggedIn: false,
      });
  }
};

export { Register, Login, Logout, isLogin };

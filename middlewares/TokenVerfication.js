import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const TokenVerfication = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "Unauthorized, please login" });
    }
    const decoded = await jwt.decode(token, process.env.SecriteKey);
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    req.userId = user._id;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export { TokenVerfication };

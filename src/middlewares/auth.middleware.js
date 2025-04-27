// This middleware use for check/verify a user exist or not

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    console.log("REQUST : ", req);

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("TOKEN :", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(" DECODED TOKEN : ", decodedToken);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    console.log("USER :", user);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;

    console.log("REQ USER :", req.user);

    next();

    // console.log("NEXT :", next());
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

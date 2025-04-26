import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend
  // Validation- not empty
  // check if user already exists: username ,email
  // check for images , check for avatar
  // upload them cloudinary, avatar
  // create user object - create entry in db
  // remove the password and refresh token field from response
  // check for user creation
  // return response

  // Get user details from frontend
  const { fullName, email, username, password } = req.body;
  console.log("Email :", email);

  console.log("Cover", req.files);
  // Validation- not empty
  if (
    [username, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: username ,email
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email and username already exists");
  }

  // check for images , check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  console.log("avatarlocalpath", avatarLocalPath);
  
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
 
  console.log("coverImage local", coverImageLocalPath);
  

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload them cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  console.log( "AVATAR", avatar);
  console.log("COVER IMAGE", coverImage);
  
  
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

console.log("USEERR", user);


  // remove the password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  console.log(" CREATED USER", createdUser);
  

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registring the user");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };

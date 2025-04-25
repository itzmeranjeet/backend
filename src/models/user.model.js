import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Before saving a user document, this middleware checks if the password field has been modified.
// If the password has not been modified, it skips further processing by calling `next()`.
// If the password has been modified, it hashes the password using bcrypt with a salt round of 10
// and then proceeds to the next middleware or saves the

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// This method is used to compare a plain text password with the hashed password stored in the database.
// It uses bcrypt's `compare` function to check if the provided password matches the hashed password.
// Returns `true` if the passwords match, otherwise `false`.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);

  /*password:  This is the plain text password provided by the user (e.g., during login). this.password: This is the hashed password stored in the database for the user.*/
};

// This method generates a JSON Web Token (JWT) for user authentication.
// The token contains the user's `_id`, `email`, `username`, and `fullName` as payload data.
// It uses the secret key defined in `process.env.ACCESS_TOKEN_SECRET` to sign the token.
// The token's expiration time is set based on `process.env.ACCESS_TOKEN_EXPIRY`.
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      minLength: 6,
      select: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;

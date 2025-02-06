import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  esAdmin: { type: Boolean, default: false }
});

export default mongoose.model("User", UserSchema);

import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import genreateToken from "../utils/genreateToken.js";

// 🟢 Register Admin
async function registerAdmin(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({ message: "Only one admin can register" });
    }

    const newAdmin = await Admin.create({
      username,
      email,
      password, 
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: { _id: newAdmin._id, username: newAdmin.username, email: newAdmin.email },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


// ✅ Login
async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Email not exists" });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Password not match" });
    }

    const token = genreateToken(admin._id);

    res.status(200).json({
      message: "Admin login successfully",
      admin: { _id: admin._id, username: admin.username, email: admin.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// 🟢 Verify Current Password
async function verifyPassword(req, res) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const admin = req.admin; // from middleware
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);

    res.status(200).json({
      success: isMatch,
      message: isMatch ? "Password is correct" : "Password is incorrect",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 🟢 Update Password
async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required" });
    }

    // get admin from auth middleware
    const admin = req.admin;
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // use model method to compare
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // update password (pre-save hook will hash automatically)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export { registerAdmin, verifyPassword, loginAdmin, updatePassword };
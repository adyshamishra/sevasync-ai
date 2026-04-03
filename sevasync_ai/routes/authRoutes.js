const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// 1. REGISTER NEW USER
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ message: "Registration failed. Email might already exist." });
    }
});

// 2. LOGIN USER
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 3. FORGOT PASSWORD (Updated with Trim and Lowercase Fix)
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    // 1. FIX: Trim spaces and make lowercase to match Atlas perfectly
    const cleanEmail = email.trim().toLowerCase(); 
    
    console.log("🚀 Forgot Password request received for:", cleanEmail); 

    try {
        // 2. Search using the cleaned email
        const user = await User.findOne({ email: cleanEmail });
        
        if (!user) {
            console.log("❌ Email not found in database:", cleanEmail);
            return res.status(404).json({ message: "User not found" });
        }

        // Generate temporary token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        console.log("🔑 Reset token generated and saved to Atlas");

        // Setup Email Transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                user: 'madyasha32@gmail.com',
                pass: 'uvlh tzxj fhhq qjad'
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'sevasync-support@gmail.com',
            subject: 'SevaSync Password Reset',
            text: `You requested a password reset. Click the link below to set a new password:\n\n` +
                  `http://localhost:3000/reset/${token}\n\n` +
                  `If you did not request this, please ignore this email.`
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Reset email sent successfully to:", user.email);
        res.json({ message: "Reset email sent!" });

    } catch (err) {
        console.log("🚨 NODEMAILER ERROR:", err);
        res.status(500).json({ message: "Error sending email" });
    }
});

// 4. RESET PASSWORD ACTION
router.post('/reset/:token', async (req, res) => {
    console.log("🔄 Attempting to reset password with token:", req.params.token);
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log("❌ Token invalid or expired");
            return res.status(400).json({ message: "Token is invalid or expired." });
        }

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        console.log("✅ Password updated successfully for:", user.email);
        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        console.log("🚨 RESET ERROR:", err);
        res.status(500).json({ message: "Error updating password." });
    }
});

module.exports = router;
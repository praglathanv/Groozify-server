const User = require('../models/User');
const Otp = require('../models/Otp'); // You can remove this if you're not using it anymore
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator'); // You can keep this for OTP generation
// You no longer need twilioClient as we're not sending SMS

const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

const authController = {
  signup: async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
  
      // Create a new user with a verification token
      const newUser = new User({
        email,
        verificationToken: '', // Initial value
        isEmailVerified: false
      });
  
      console.log(newUser); // Log the user object before saving
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully. Please verify your email.' });
    } catch (err) {
      console.error('Signup error:', err); // Log the error to the console
      res.status(500).json({ error: 'Server error' });
    }
  },  
  
  verifyEmail: async (req, res) => {
    const { email } = req.body;
  
    try {
      // Generate verification token (OTP)
      const token = otpGenerator.generate(6, { upperCase: false, specialChars: false });
  
      // Update the user with the verification token
      await User.findOneAndUpdate(
        { email },
        { verificationToken: token },
        { new: true }
      );
  
      // Prepare the email options
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: email, // List of recipients
        subject: 'Email Verification', // Subject line
        text: `Your verification code is: ${token}`, // Plain text body
        // If you want to send HTML content instead, you can use the `html` property:
        // html: `<p>Your verification code is: <strong>${token}</strong></p>`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      res.json({ message: 'Verification token sent to your email.' });
    } catch (err) {
      console.error('Error sending verification email:', err);
      res.status(500).json({ error: 'Error sending verification email' });
    }
  },
  

  checkVerification: async (req, res) => {
    const { email, token } = req.body;

    try {
      // Find the user by email and token
      const user = await User.findOne({ email, verificationToken: token });
      if (!user) {
        return res.status(400).json({ error: 'Invalid verification token' });
      }

      // Mark email as verified
      await User.findOneAndUpdate(
        { email },
        { isEmailVerified: true, verificationToken: '' }, // Clear the token after verification
        { new: true }
      );

      res.json({ message: 'Email verified successfully' });
    } catch (err) {
      console.error('Error verifying email:', err);
      res.status(500).json({ error: 'Error verifying email' });
    }
  },

  login: async (req, res) => {
    const { email } = req.body;

    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.isEmailVerified) {
        return res.status(403).json({ error: 'Email not verified' });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      // Set JWT in cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ message: 'Login successful', user: { email: user.email } });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  logout: (req, res) => {
    res.cookie('token', '', { maxAge: 1 }); // Clear the cookie by setting a very short expiration time
    res.json({ message: 'Logout successful' });
  },

  checkAuth: async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: 'No token provided' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(401).json({ error: 'Invalid token' });

      res.json({ isAuthenticated: true, user: { email: user.email } });
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
};

module.exports = authController;

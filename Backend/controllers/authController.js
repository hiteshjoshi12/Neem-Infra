import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d'
  });
};

// @desc   Auth admin & get token
// @route  POST /api/auth/login
// @access Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get current logged in admin
// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.admin
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

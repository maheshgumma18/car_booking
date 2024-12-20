const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    token=req.headers['token']
    
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

exports.isAdmin = (req, res, next) => {
    const user=req.body
    console.log(user)
    if (user && user.role === 'admin') {
        req.user=user
        next();
    } else {
        res.status(403).json({ message: 'Not authorized, admin access required' });
    }
};

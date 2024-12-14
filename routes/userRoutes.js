const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers } = require('../controllers/userController');
const { protect,isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get("/allusers",isAdmin,getAllUsers)

module.exports = router;

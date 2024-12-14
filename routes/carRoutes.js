const express = require('express');
const { addCar, getCars } = require('../controllers/carController');


const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', protect, isAdmin, addCar);
router.get('/', protect, getCars);

module.exports = router;

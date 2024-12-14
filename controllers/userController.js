const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.registerUser = async (req, res) => {
    const { name, email, password,role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: role!==undefined?role:'customer'
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (user ) {
        await bcrypt.compare(password, user.password).then(()=>{
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
            });
        }).catch((err)=>{
            res.status(401).json({message:err });
        })
        
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: generateToken(updatedUser.id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.getAllUsers= async (req,res)=>{

    const users= await User.find({})
    if(users){
        res.status(200).json({users:users})
    }
    else{
        res.status(404).json({message:'data not found error'})
    }
}

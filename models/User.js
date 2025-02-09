const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber:{type:String},
    Address:{type:String},
    profilePicture:{type:String},
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    vehicles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Vehicle', 
        },
      ],
});


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

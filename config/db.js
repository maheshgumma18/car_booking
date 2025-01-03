const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
        
            serverSelectionTimeoutMS: 50000, // Increase the timeout to 50 seconds
  socketTimeoutMS: 45000 
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
 
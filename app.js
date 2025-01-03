const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const carRoutes = require('./routes/carRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const reviewRoutes=require('./routes/reviewRoutes')
const garageRoutes=require('./routes/garageRoutes')
dotenv.config();

connectDB();

const app = express();
app.use("/uploads", express.static("uploads")); 
app.use(express.json());
 
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews',reviewRoutes)
app.use('/api/garageRoutes',garageRoutes)

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(process.env.MONGO_URI)
});

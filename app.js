const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const reviewRoutes=require('./routes/reviewRoutes')
const garageRoutes=require('./routes/garageRoutes')
const vehicleRoutes=require('./routes/vehicleRoutes')
const serviceRoutes=require('./routes/serviceRoutes')
const bookingRoutes=require('./routes/bookingRoutes')
dotenv.config();

connectDB();

const app = express();
app.use("/uploads", express.static("uploads")); 
app.use(express.json());
 

app.use('/api/users', userRoutes);
app.use('/api/reviews',reviewRoutes)
app.use('/api/garageRoutes',garageRoutes)
app.use('/api/vehicle',vehicleRoutes)
app.use('/api/service',serviceRoutes)
app.use('/api/booking',bookingRoutes)


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(process.env.MONGO_URI)
});

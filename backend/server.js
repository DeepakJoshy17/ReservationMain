const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const boatRoutes = require('./routes/boatRoutes');
const routeRoutes = require('./routes/routeRoutes');
const routeStopsRoutes = require('./routes/routeStopsRoutes');
const stopPricingRoutes = require('./routes/stopPricingRoutes');
const stopTimeRoutes = require('./routes/stopTimeRoutes');
const seatRoutes = require('./routes/seatRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userBookingRoutes = require('./routes/userBookingRoutes');
// const seatViewRoutes = require('./routes/seatViewRoutes');
const userPaymentRoutes = require('./routes/userPaymentRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Enable cookies and sessions
}));
app.use(express.json()); // This ensures req.body is properly parsed
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set secure: true in production with HTTPS
}));

// Admin Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/boats', boatRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/route_stops', routeStopsRoutes);
app.use('/api/stop_pricing', stopPricingRoutes);
app.use('/api', stopTimeRoutes);
app.use('/api', seatRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/seat-bookings', bookingRoutes);

// User Routes
app.use('/api/userBookings', userBookingRoutes);
// app.use('/api/userBookings', seatViewRoutes); // API path for seat bookings
app.use('/api/userBookings', userPaymentRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

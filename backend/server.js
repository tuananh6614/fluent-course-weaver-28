
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EduHub API is running',
  });
});

// Error handling middleware
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

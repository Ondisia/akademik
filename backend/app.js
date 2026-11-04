require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { rateLimit } = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const sequelize = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  message: { success: false, message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.' },
});
app.use('/api/', limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Register all routes
app.use('/api', routes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Akademik SMK API' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Sync database tanpa alter (menggunakan force: false agar tidak drop table)
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`=================================`);
    console.log(`Server running on ${HOST}:${PORT}`);
    console.log(`Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`=================================`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
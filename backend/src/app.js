const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { clientOrigin } = require('./config/env');
const { logger } = require('./config/logger');

const app = express();

app.use(helmet());
app.use(cors({
  origin: clientOrigin,
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'OK',
    data: { uptime: process.uptime() }
  });
});

app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));
app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

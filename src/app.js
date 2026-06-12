const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const alertRoutes = require('./routes/alerts');
const dashboardRoutes = require('./routes/dashboard');
const highlightedIpRoutes = require('./routes/highlightedIps');
const healthRoutes = require('./routes/health');
const { errorHandler } = require('./middleware/errorHandler');

// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Swagger docs
try {
  const swaggerDoc = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
} catch (e) {
  // Swagger optional
}

// Routes
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/highlighted-ips', highlightedIpRoutes);
app.use('/api/health', healthRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;

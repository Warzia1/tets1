// ===============================================
// Code édité par : Baptiste COSTAMAGNA
// Contact : costamagna.e2101629@etud.univ-ubs.fr
// Membres ayant participer au projet : Aya Fsahi (e2305372@etud.univ-ubs.fr), Pierre Wadra (e2303942@etud.univ-ubs.fr)
// Date : 2024-11-08 22:54:22
// ===============================================

const express = require("express");
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const YAML = require('yamljs');
const path = require('path');
require('dotenv').config({ override: true });

const connectDB = require('./config/database');

// Check for required environment variables
function checkEnvVariables() {
    const requiredEnvVars = ['USERNAME', 'PASSWORD', 'RUGM_HOST', 'DB_HOST', 'DB_NAME'];
    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingVars.length > 0) {
        console.error(`Error: The following environment variables are missing: ${missingVars.join(', ')}`);
        process.exit(1); // Exit the process if any required variable is missing
    }
}

// Call the function to check environment variables
checkEnvVariables();

// Connect to the database
connectDB();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load the openapi.yaml file
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

// Swagger UI setup
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import and use the routes
const uploadRouter = require('./routes/upload');
app.use('/', uploadRouter);

const deleteRouter = require('./routes/delete');
app.use('/', deleteRouter);

const downloadRouter = require('./routes/download');
app.use('/', downloadRouter);

const listingRouter = require('./routes/listing');
app.use('/', listingRouter);

const updateRouter = require('./routes/update');
app.use('/', updateRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Documentation accessible at http://localhost:${port}/api-doc`);
});

require('dotenv').config({ path: '../.env' });
const express = require('express');
const organizationsRoutes = require('./src/routes/organizations');
const departmentsRoutes = require('./src/routes/departments');
const positionsRoutes = require('./src/routes/positions');
const employeesRoutes = require('./src/routes/employees');
const regionsRoutes = require('./src/routes/regions');
const citysRoutes = require('./src/routes/citys');
const filesRoutes = require('./src/routes/files');
const operationsRoutes = require('./src/routes/operations');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', organizationsRoutes);
app.use('/api', departmentsRoutes);
app.use('/api', positionsRoutes);
app.use('/api', employeesRoutes);
app.use('/api', regionsRoutes);
app.use('/api', citysRoutes);
app.use('/api', filesRoutes);
app.use('/api', operationsRoutes);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
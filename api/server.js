require('dotenv').config({ path: '../.env' });
const express = require('express');
const organizationsRoutes = require('./routes/organizations');
const departmentsRoutes = require('./routes/departments');
const positionsRoutes = require('./routes/positions');
const employeesRoutes = require('./routes/employees');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', organizationsRoutes);
app.use('/api', departmentsRoutes);
app.use('/api', positionsRoutes);
app.use('/api', employeesRoutes);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
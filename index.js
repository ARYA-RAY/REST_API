const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeesRouter = require('./employees');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', employeesRouter);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

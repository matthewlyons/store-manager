const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from Touchscreen Product Routes');
});
app.get('/Category/:id', (req, res) => {
  const data = require(`./data/${req.params.id}.json`);
  console.log(req.params.id);
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
});

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server running on port ${port}`));

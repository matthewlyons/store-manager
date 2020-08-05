const express = require('express');
const path = require('path');
const app = express();

const proxy = require('express-http-proxy');

app.use(express.static(path.resolve(__dirname, 'client', 'build')));

app.use('/api', proxy('http://localhost:5000'));
app.use('/bulk', proxy('http://localhost:5001'));
app.use('/invoice', proxy('http://localhost:5002'));
app.use('/auth', proxy('http://localhost:5003'));
app.use('/static-assets', proxy('http://localhost:5004'));
app.use('/tax', proxy('http://localhost:5006'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 80;

app.listen(port, () => console.log(`Server running on port ${port}`));

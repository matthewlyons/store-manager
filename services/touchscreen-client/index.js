const express = require('express');
const path = require('path');
const childProcess = require('child_process');
const app = express();

app.use(express.static(path.resolve(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 3001;

childProcess.exec(`start chrome --kiosk http://localhost:${port}/`);

app.listen(port, () => console.log(`Server running on port ${port}`));

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function(req, res) {
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(4300, () => { console.log('listen on port 4300');});
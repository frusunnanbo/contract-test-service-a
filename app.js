app = require('express')();

app.get('/', (request, response) => response.send('Service 2'));

app.listen(3002);

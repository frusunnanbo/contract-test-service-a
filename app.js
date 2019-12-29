const app = require('express')();
const { getStuff } = require('./apiClient');

app.get('/', (request, response) => response.send('Service 2'));
app.get('/stuff', (request, response) => getStuff()
        .then((stuff) => response
                .json(stuff))
        .catch((err) =>
                response.status(500)
                .send(`failed to get stuff: ${err.stack}`)));

app.listen(3002, console.log('Listening on 3002'));

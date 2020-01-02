const express = require('express');
const expressHbs = require('express-handlebars');

const { getStuff } = require('./apiClient');

const port = process.env.PORT || 3002

const app = express();

app.use(express.static('static'));

app.engine('handlebars', expressHbs());
app.set('view engine', 'handlebars');
app.get('/', async (request, response) => {
    response.render('animals',
            {
                layout: false,
                animals: await getStuff()
            });
});

app.get('/stuff', (request, response) => getStuff()
        .then((stuff) => response
                .json(stuff))
        .catch((err) =>
                response.status(500)
                .send(`failed to get stuff: ${err.stack}`)));

app.listen(port, console.log(`Listening on ${port}`));

const app = require('express')();
const expressHbs = require('express-handlebars');

const { getStuff } = require('./apiClient');

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

app.listen(3002, console.log('Listening on 3002'));

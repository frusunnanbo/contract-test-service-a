const express = require('express');
const expressHbs = require('express-handlebars');

const { fetchAnimals } = require('./serviceCClient');

const port = process.env.PORT || 3001;

const app = express();

app.use(express.static('static'));

app.engine('handlebars', expressHbs());
app.set('view engine', 'handlebars');
app.get('/', async (request, response) => {
    response.render('animals',
            {
                layout: false,
                animals: await fetchAnimals(request.query.kind)
            });
});

app.get('/animals', (request, response) => getAnimals(request, response));

app.listen(port, console.log(`Listening on ${port}`));

function getAnimals(request, response) {
    fetchAnimals(request.query.kind)
            .then((stuff) => response
                    .json(stuff))
            .catch((err) =>
                    response.status(500)
                            .send(`failed to get animals: ${err.stack}`));
}

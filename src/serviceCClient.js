const request = require('request-promise-native');

const API_URL = process.env.API_ENDPOINT+ '/animals';

function toVisitorInformation(animal) {
    return {
        name: animal.name,
        image: process.env.API_ENDPOINT + animal.image.path,
        age: animal.age,
        description: animal.description || `A description of ${animal.name}.`
    }
}

function getRequestWithQueryString(kind) {
    return {
        uri: API_URL,
        json: true,
        qs: {
            kind: kind
        },
    };
}

function fetchAnimals(kind) {
    return request(getRequestWithQueryString(kind))
            .then((animals) => animals.map((animal) => toVisitorInformation(animal)))
            .catch(`Failed to fetch animals from ${API_URL}`)
}

module.exports = {
  fetchAnimals
};

const request = require('request-promise-native');

const API_URL = process.env.API_ENDPOINT+ '/animals';

const options = {
    uri: API_URL,
    json: true
};

function toVisitorInformation(animal) {
    return {
        name: animal.name,
        kind: animal.kind
    }
}

function getStuff() {
    return request(options)
            .then((animals) => animals.map((animal) => toVisitorInformation(animal)))
            .catch(`Failed to fetch animals from ${API_URL}`)
}

module.exports = {
  getStuff
};

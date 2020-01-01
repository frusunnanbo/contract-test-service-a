const pact = require('@pact-foundation/pact-node');
const path = require('path');

const opts = {
    pactFilesOrDirs: [path.resolve(__dirname, './pacts/')],
    pactBroker: 'https://frusunnanbo.pact.dius.com.au/',
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    consumerVersion: '1.0.0'
};

pact.publishPacts(opts)
        .then(() => {
            console.log('Pact contract publishing complete!')
        })
        .catch(e => {
            console.log('Pact contract publishing failed: ', e)
        });

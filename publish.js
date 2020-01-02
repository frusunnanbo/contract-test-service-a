const pact = require('@pact-foundation/pact-node');
const path = require('path');
const { execSync } = require('child_process');

const gitVersion = execSync('git rev-parse HEAD').toString().trim();

const opts = {
    pactFilesOrDirs: [path.resolve(__dirname, './pacts/')],
    pactBroker: 'https://frusunnanbo.pact.dius.com.au/',
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    consumerVersion: `${process.env.npm_package_version}-${gitVersion}`
};

pact.publishPacts(opts)
        .then(() => {
            console.log('Pact contract publishing complete!')
        })
        .catch(e => {
            console.log('Pact contract publishing failed: ', e)
        });

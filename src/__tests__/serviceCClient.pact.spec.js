const path = require('path');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {like} = Matchers;
const {fetchAnimals} = require('../serviceCClient');

const provider = new Pact({
    consumer: 'Service A',
    provider: 'Service C',
    port: 2345,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'INFO',
    spec: 2
});

const hedgehogMatcher = {
    name: like('Joy'),
    kind: 'hedgehog',
    age: like(4),
    description: like('This is a description of Joy'),
    image: like({
        path: '/path/to/image'
    }),
};

describe('Contract with Service C', () => {
    describe('when a request for animals is made', () => {

        beforeEach(() => {
            const interactionWithFilter = {
                state: 'there are 2 hedgehogs and 1 cat',
                uponReceiving: 'a request for animals',
                withRequest: {
                    path: '/',
                    method: 'GET',
                    query: 'kind=hedgehog'
                },
                willRespondWith: {
                    body: [hedgehogMatcher, hedgehogMatcher],
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            };
            return provider
                    .setup()
                    .then(() => provider.addInteraction(interactionWithFilter));
        });

        it('will receive a list of hedgehogs with pictures', () => {
            const serviceAAnimalMatcher = expect.toContainAllEntries([
                ['name', expect.any(String)],
                ['age', expect.any(Number)],
                ['image', expect.any(String)],
                ['description', expect.any(String)]]);
            return expect(fetchAnimals('hedgehog'))
                    .resolves
                    .toIncludeSameMembers([serviceAAnimalMatcher, serviceAAnimalMatcher]);
        });

        afterEach(() => {
            provider.finalize();
        })
    })
});

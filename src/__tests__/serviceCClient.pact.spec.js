const path = require('path');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {like, eachLike } = Matchers;
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

const animalMatcher = {
    name: like('Hufflepuff'),
    kind: like('cat'),
    age: like(4),
    description: like('This is a description of Hufflepuff'),
    image: like({
        path: '/path/to/image'
    }),
};

describe('Contract with Service C', () => {
    beforeAll(() => {
        return provider.setup()
    });

    describe('when a request for all animals is made', () => {
        beforeAll(() => {
            const allAnimalsInteraction = {
                state: 'there are >= 3 animals',
                uponReceiving: 'a request for animals',
                withRequest: {
                    path: '/',
                    method: 'GET'
                },
                willRespondWith: {
                    body: eachLike(animalMatcher, { min: 3}),
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            };
            return provider.addInteraction(allAnimalsInteraction);
        });

        it('can process the JSON payload from the provider', () => {
            const serviceAAnimalMatcher = expect.toContainAllEntries([
                ['name', expect.any(String)],
                ['age', expect.any(Number)],
                ['image', expect.any(String)],
                ['description', expect.any(String)]]);
            return expect(fetchAnimals())
                    .resolves
                    .toIncludeAllMembers([serviceAAnimalMatcher, serviceAAnimalMatcher, serviceAAnimalMatcher]);
        });

        it('validates the interactions and creates a contract', () => {
            return provider.verify()
        });
    });

    describe('when a request for hedgehogs is made', () => {

        beforeAll(() => {
            const hedgehogInteraction = {
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
            return provider.addInteraction(hedgehogInteraction);
        });

        it('can process the JSON payload from the provider', () => {
            const serviceAAnimalMatcher = expect.toContainAllEntries([
                ['name', expect.any(String)],
                ['age', expect.any(Number)],
                ['image', expect.any(String)],
                ['description', expect.any(String)]]);
            return expect(fetchAnimals('hedgehog'))
                    .resolves
                    .toIncludeSameMembers([serviceAAnimalMatcher, serviceAAnimalMatcher]);
        });

        it('validates the interactions and creates a contract', () => {
            return provider.verify()
        });

    });

    afterAll(() => {
        provider.finalize();
    })

});

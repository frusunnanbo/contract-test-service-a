const path = require('path');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {like} = Matchers;
const {fetchAnimals} = require('../apiClient');

const provider = new Pact({
    consumer: 'Service A',
    provider: 'Service C',
    port: 2345,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'INFO',
    spec: 2
});

describe('Contract with Service C', () => {

    describe('when a call to get animals is made', () => {

        beforeEach(() => {
            const interaction = {
                state: 'there are 2 hedgehogs and 1 cat',
                uponReceiving: 'a request for animals',
                withRequest: {
                    path: '/animals',
                    method: 'GET',
                    query: 'kind=hedgehog'
                },
                willRespondWith: {
                    body: [{
                        name: like("Joy"),
                        kind: "hedgehog",
                        image: like({
                            path: "/path/to/image"
                        }),
                        funFact: like("likes to be scratched on her belly"),
                        foodSchedule: like({
                            morning: "Some insects. 10 worms. 1/4 apple",
                            lunch: "Some insects. 10 worms. 1/4 apple",
                            evening: "Some insects. 10 worms. 1/4 apple"
                        }),
                    }, {
                        name: like("Joy"),
                        kind: "hedgehog",
                        image: like({
                            path: "/path/to/image"
                        }),
                        //funFact: like("likes to be scratched on her belly"),
                        foodSchedule: like({
                            morning: "Some insects. 10 worms. 1/4 apple",
                            lunch: "Some insects. 10 worms. 1/4 apple",
                            evening: "Some insects. 10 worms. 1/4 apple"
                        }),
                    },
                    ],
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            };
            return provider
                    .setup()
                    .then(() => provider.addInteraction(interaction));
        });

        it('will receive a list of hedgehogs with pictures', () => {
            return expect(fetchAnimals('hedgehog')).resolves.toIncludeSameMembers([
                        expect.toContainAllEntries([['name', expect.any(String)], ['kind', 'hedgehog'], ['image', expect.any(String)]]),
                        expect.toContainAllKeys(['name', 'kind', 'image']),
                    ]
            );
        });

        afterEach(() => {
            provider.finalize();
        })
    })
});

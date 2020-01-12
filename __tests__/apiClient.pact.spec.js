const path = require('path');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {getStuff} = require('../apiClient');

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
                uponReceiving: 'a request for animals',
                withRequest: {
                    path: '/animals',
                    method: 'GET',
                },
                willRespondWith: {
                    body: Matchers.eachLike({
                                name: "Joy",
                                kind: "hedgehog",
                                image: {
                                    path: "/path/to/image"
                                },
                                foodSchedule: {
                                    morning: "Some insects. 10 worms. 1/4 apple",
                                    lunch: "Some insects. 10 worms. 1/4 apple",
                                    evening: "Some insects. 10 worms. 1/4 apple"
                                },
                            },
                            {
                                min: 3
                            }),
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

        it('will receive a list of animals with pictures', () => {
            return expect(getStuff()).resolves.toIncludeSameMembers([
                        expect.toContainAllKeys(['name', 'kind', 'image']),
                        expect.toContainAllKeys(['name', 'kind', 'image']),
                        expect.toContainAllKeys(['name', 'kind', 'image']),
                    ]
            );
        });

        afterEach(() => {
            provider.finalize();
        })
    })
});

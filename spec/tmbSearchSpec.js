/**
 * Created by michogarcia on 9/05/16.
 */

describe("tmb.search.js spec:", function() {
    var keys;

    beforeEach(function(done) {
        axios.get("base/api_keys.json").then(function(response) {
            keys = response.data;
            done();
        }, fail)
    });

    describe("API search call", function() {
        var result, http;

        beforeEach(function(done) {
            api = tmb(keys.app_id, keys.app_key);
            http = api.http;
            spyOn(http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/search.catalunya.json'));
            });

            function handleSuccess(response) {
                result = response;
                done();
            }

            api.search.query('catalunya').then(handleSuccess, fail);
        });

        it("as default should search for a term and return 20 records", function() {
            expect(http.get).toHaveBeenCalled();
            expect(http.get).toHaveBeenCalledWith('search', { params : { q : 'catalunya', rows: 20 } } );
            expect(result.response.numFound).toBe(54);
            expect(result.response.start).toBe(0);
            expect(result.response.docs.length).toBe(20);
        })
    });

    describe("Set resultsPerPage", function() {
        var api;

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);

            spyOn(api.http, 'get').and.callFake(function(url, options) {
                return Promise.resolve({
                    "docs": new Array(options.params.rows)
                });
            });
        });

        it("should let change default resultsPerPage value", function(done) {
            api.search.config.resultsPerPage = 10;
            api.search.query('catalunya').then(checkResponse, fail);

            function checkResponse(response) {
                expect(response.docs.length).toBe(10);
                done();
            }

        });

        it("should let indicate a specific resultsPerPage value as a query option", function(done) {
            api.search.query('catalunya', { resultsPerPage: 15 }).then(checkResponse, fail);

            function checkResponse(response) {
                expect(response.docs.length).toBe(15);
                done();
            }
        });


    });

    describe("Other per-query options", function() {
        var api;

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);

            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve();
            });
        });

        it("should filter results by a controlled list of ENTITATS", function(done) {
            var inputs = [
                [api.search.ENTITATS.ESTACIONS], // Preferred syntax - array of predefined constants
                api.search.ENTITATS.ESTACIONS, // but for a single element, it is also valid to pass the value directly
                'Estacions', // Or even the value, but beware of the spelling (case, or accent on 'Línies')!
                [api.search.ENTITATS.ESTACIONS, api.search.ENTITATS.LINIES], // Preferred syntax again, two elements
                ['Estacions', 'Línies'], // Less optimal
                'Estacions,Línies' // This works too, already concatenated string
            ];

            var outputs = [ // This is what we should get in the end
                'Estacions',
                'Estacions',
                'Estacions',
                'Estacions,Línies',
                'Estacions,Línies',
                'Estacions,Línies'
            ];

            var queries = inputs.map(function(input) {
                return api.search.query('catalunya', { entitats: input });
            });

            Promise.all(queries).then(function(responses) {
                expect(api.http.get.calls.count()).toEqual(6);
                for (var i in responses) {
                    var param = api.http.get.calls.argsFor(i)[1].params.entitats;
                    expect(param).toEqual(outputs[i]);
                }
                done();
            }, fail);

        });

        it("should have an option to enable detailed responses", function(done) {
            api.search.query('catalunya', { detail: true }).then(check, fail);

            function check() {
                var params = api.http.get.calls.argsFor(0)[1].params;
                expect(params.fl).toBeDefined();
                expect(params.fl).toEqual("*");
                done();
            }
        });
    });

    /*
    describe("Get a fucking real response", function() {
        var api;

        beforeEach(function () {
            api = tmb(keys.app_id, keys.app_key);
        });

        it("should return a real response", function (done) {
            api.search.query('catalunya').then(check, fail);

            function check(response) {
                console.log(JSON.stringify(response, null, 2));
                done();
            }

        });

    });
    */
});

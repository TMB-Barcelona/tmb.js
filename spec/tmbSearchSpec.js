/**
 * Created by michogarcia on 9/05/16.
 */

describe("tmb.search.js spec:", function() {
    var keys, api;

    beforeEach(function(done) {
        axios.get("base/api_keys.json").then(function(response) {
            keys = response.data;
            api = tmb(keys.app_id, keys.app_key);
            done();
        })
    });


    describe("API search call", function() {
        var result, http;

        beforeEach(function(done) {

            http = api.http;
            spyOn(http, 'get').and.callFake(function () {
                return {
                    then: function (callback) {
                        var response = readJSON('spec/fixtures/search.catalunya.20.json');
                        return callback(response);
                    }
                }
            });

            function handleSuccess(response) {
                result = response;
                done();
            }

            function handleError() {
                result = false;
                done();
            }

            api.search.query('catalunya').then(handleSuccess, handleError);
        });

        it("as default should search for a term and return 20 records", function() {
            expect(http.get).toHaveBeenCalled();
            expect(http.get).toHaveBeenCalledWith('search', { params : { q : 'catalunya', rows: 20 } } );
            expect(result.response.numFound).toBe(54);
            expect(result.response.start).toBe(0);
            expect(result.response.docs.length).toBe(20);
        })
    });

    describe("API search options", function() {

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);

            spyOn(api.http, 'get').and.callFake(function(url, options) {
                return {
                    then: function (callback) {
                        // Return a result page with as many elements as rows specified on query params
                        var response = { "docs": new Array(options.params.rows) };
                        return callback(response);
                    }
                }
            });
        });

        it("should let change default resultsPerPage value", function(done) {
            api.search.config.resultsPerPage = 10;
            api.search.query('catalunya').then(checkResultCount);

            function checkResultCount(results) {
                expect(results.docs.length).toBe(10);
                done();
            }

        });

        it("should let indicate a specific resultsPerPage value as a query option", function(done) {
            api.search.query('catalunya', { resultsPerPage: 15 }).then(checkResultCount);

            function checkResultCount(results) {
                expect(results.docs.length).toBe(15);
                done();
            }
        });
    })

});

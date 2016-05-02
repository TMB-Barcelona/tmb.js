/**
 * Created by michogarcia on 17/03/16.
 */
var IN_NODE = (typeof module === 'object' && module.exports);

if (IN_NODE) {
    // Load module under test.
    var tmb = require('../dist/tmb');
}

describe("tmb.js spec:", function() {
    var keys, api;

    beforeEach(function(done) {
        // Get API keys and instantiate API. Depends on environment.
        if (IN_NODE) {
            keys = require('../api_keys.json');
            api = tmb(keys.app_id, keys.app_key);
            done();
        } else {
            axios.get("base/api_keys.json").then(function(response) {
                keys = response.data;
                api = tmb(keys.app_id, keys.app_key);
                done();
            })
        }
    });

    it("should have a hello world function returning id and key", function() {
        var greeting = api.helloWorld;
        expect(greeting).toBeTruthy();
        expect(greeting).toContain(keys.app_id);
        expect(greeting).toContain(keys.app_key);
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
                done()
            }

            function handleError(error) {
                result = false;
                done()
            }

            api.search('catalunya').then(handleSuccess, handleError);
        });

        it("as default should search for a term and return 20 records", function() {
            expect(http.get).toHaveBeenCalled();
            expect(http.get).toHaveBeenCalledWith('search', { params : { q : 'catalunya', rows: 20 } } );
            expect(result.response.numFound).toBe(54);
            expect(result.response.start).toBe(0);
            expect(result.response.docs.length).toBe(20);
        })
    });
    
    describe("API search call", function() {
        var result, http;

        beforeEach(function(done) {
            
            var options = {};
            options.rows = 10;

            api = tmb(keys.app_id, keys.app_key, options);
            
            http = api.http;
            spyOn(http, 'get').and.callFake(function () {
                return {
                    then: function (callback) {
                        var response = readJSON('spec/fixtures/search.catalunya.json');
                        return callback(response);
                    }
                }
            });

            function handleSuccess(response) {
                result = response;
                done()
            }

            function handleError(error) {
                result = false;
                done()
            }

            api.search('catalunya').then(handleSuccess, handleError);
        });

        it("should search for a term and return 10 records passing rows parameter in options", function() {
            expect(http.get).toHaveBeenCalled();
            expect(http.get).toHaveBeenCalledWith('search', { params : { q : 'catalunya', rows: 10 } } );
            expect(result.response.numFound).toBe(54);
            expect(result.response.start).toBe(0);
            expect(result.response.docs.length).toBe(10);
        })
    })

});

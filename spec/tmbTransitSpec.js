/**
 * Created by michogarcia on 6/06/16.
 */

describe("tmb.transit.js spec:", function() {
    var keys;

    beforeEach(function(done) {
        axios.get("base/api_keys.json").then(function(response) {
            keys = response.data;
            done();
        })
    });

    describe("Get linies from transit", function() {
        var result, http;

        function handleError() {
            expect(false).toBeTruthy();
            done();
        }

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);
            http = api.http;
            spyOn(http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.json'));
            });
        });

        it("as default should get all linies from transit endpoint", function(done) {

            api.transit.linies().then(handleSuccess, handleError);

            function handleSuccess(response) {
                result = response;
                expect(http.get).toHaveBeenCalledWith('transit/linies/');
                expect(result.totalFeatures).toBe(257);
                done();
            }
        });
    });

    describe("Get linie with codi 22 from transit", function() {
        var result, http;

        function handleError() {
            expect(false).toBeTruthy();
            done();
        }

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);
            http = api.http;
            spyOn(http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/linie.22.json'));
            });
        });

        it("should get line with codi 22 from transit endpoint", function(done) {

            api.transit.linies(22).then(handleSuccess, handleError);

            function handleSuccess(response) {
                var FIRST = 0;
                result = response;
                expect(http.get).toHaveBeenCalledWith('transit/linies/22');
                expect(result.totalFeatures).toBe(2);
                expect(parseInt(result.features[FIRST].properties.CODI_LINIA)).toBe(22);
                done();
            }
        });
    });
});
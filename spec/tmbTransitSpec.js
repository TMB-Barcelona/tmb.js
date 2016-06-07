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

            function handleError() {
                expect(false).toBeTruthy();
                done();
            }
        })
    });
});
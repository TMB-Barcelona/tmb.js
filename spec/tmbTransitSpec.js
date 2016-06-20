/**
 * Created by michogarcia on 6/06/16.
 */

describe("tmb.transit.js spec:", function() {
    var keys = readJSON('api_keys.json');

    describe("Get linies", function() {
        var api;

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);
        });

        it("should get all linies by default", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.json'));
            });

            api.transit.linies().then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/');
                expect(response.totalFeatures).toBe(257);
                done();
            }
        });

        it("should get lines with a particular code", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.22.json'));
            });

            api.transit.linies(22).then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/22');
                expect(response.totalFeatures).toBe(2);
                response.features.forEach(function(feature) {
                    expect(feature.properties.CODI_LINIA).toBe(22);
                });
                done();
            }
        });
    });
});

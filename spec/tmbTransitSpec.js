/**
 * Created by michogarcia on 6/06/16.
 */

describe("tmb.transit.js spec:", function() {

    var tmb = require('../src/tmb');
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

            api.transit.linies().info().then(handleSuccess, fail);

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

            api.transit.linies(22).info().then(handleSuccess, fail);

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

    describe("Get parades", function() {
        var api;

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);
        });

        it("should get all parades from a line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.parades.json'));
            });

            api.transit.linies(2).parades().then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/bus/2/parades/');
                expect(response.totalFeatures).toBe(2722);
                done();
            }
        });

        it("should get one parada from a bus line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.parades.1244.json'));
            });

            api.transit.linies(2).parades(1244).then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/bus/2/parades/1244');
                expect(response.totalFeatures).toBe(1);
                response.features.forEach(function(feature) {
                    expect(feature.properties.CODI_PARADA).toBe(1244);
                });
                done();
            }
        });
    });

    describe("Get estacions", function() {
        var api;

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);
        });

        it("should get all estacions by default", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.estacions.json'));
            });

            api.transit.linies(2).estacions().then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/metro/2/estacions/');
                expect(response.totalFeatures).toBe(130);
                done();
            }
        });

        it("should get estacions with a particular code", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.estacions.6660126.json'));
            });

            api.transit.linies(2).estacions(6660126).then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/metro/2/estacions/6660126');
                expect(response.totalFeatures).toBe(1);
                response.features.forEach(function(feature) {
                    expect(feature.properties.CODI_GRUP_ESTACIO).toBe(6660126);
                });
                done();
            }
        });
    });

});

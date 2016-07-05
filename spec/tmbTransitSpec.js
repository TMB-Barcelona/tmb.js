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
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.22.parades.json'));
            });

            api.transit.linies(22).parades().then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/bus/22/parades/');
                expect(response.totalFeatures).toBe(33);
                done();
            }
        });

        it("should get one parada from a bus line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.22.parades.2608.json'));
            });

            api.transit.linies(22).parades(2608).then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/bus/22/parades/2608');
                expect(response.totalFeatures).toBe(2);
                response.features.forEach(function(feature) {
                    expect(feature.properties.CODI_PARADA).toBe(2608);
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

        it("should get all estacions from a line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.2.estacions.json'));
            });

            api.transit.linies(2).estacions().then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/metro/2/estacions/');
                expect(response.totalFeatures).toBe(18);
                done();
            }
        });

        it("should get one estacio from a metro line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.2.estacions.213.json'));
            });

            api.transit.linies(2).estacions(213).then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/metro/2/estacions/213');
                expect(response.totalFeatures).toBe(1);
                response.features.forEach(function(feature) {
                    expect(feature.properties.CODI_ESTACIO_LINIA).toBe(213);
                });
                done();
            }
        });
    });

});

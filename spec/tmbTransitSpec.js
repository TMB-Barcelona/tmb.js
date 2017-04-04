/**
 * Created by michogarcia on 6/06/16.
 */

describe("tmb.transit.js spec:", function() {

    var tmb = require('../src/tmb');
    var keys = readJSON('api_v2_keys.json');

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

    describe("Get Bus Parades", function() {
        var api;

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);
        });

        it("should get all parades from a line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.bus.22.parades.json'));
            });

            api.transit.linies.bus(22).parades().then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/bus/22/parades/');
                expect(response.totalFeatures).toBe(33);
                done();
            }
        });

        it("should get an ordered list of parades for both directions", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.bus.22.parades.json'));
            });

            var actions = [
                api.transit.linies.bus(22).parades().anada,
                api.transit.linies.bus(22).parades().tornada
            ];

            Promise.all(actions).then(handleSuccess, fail);

            function handleSuccess(parades) {
                var paradesAnada = parades[0];
                var paradesTornada = parades[1];

                expect(paradesAnada.totalFeatures).toBe(paradesAnada.features.length);
                expect(paradesTornada.totalFeatures).toBe(paradesTornada.features.length);
                expect(paradesAnada.totalFeatures + paradesTornada.totalFeatures).toBe(33);

                var ordre = Number.NEGATIVE_INFINITY;
                paradesAnada.features.forEach(function(parada) {
                    expect(parada.properties.SENTIT).toEqual("A");
                    expect(parada.properties.ORDRE).toBeGreaterThan(ordre);
                    ordre = parada.properties.ORDRE;
                });

                ordre = Number.NEGATIVE_INFINITY;
                paradesTornada.features.forEach(function(parada) {
                    expect(parada.properties.SENTIT).toEqual("T");
                    expect(parada.properties.ORDRE).toBeGreaterThan(ordre);
                    ordre = parada.properties.ORDRE;
                });

                expect(api.http.get).toHaveBeenCalledWith('transit/linies/bus/22/parades/');
                done();
            }

        });

        it("should get one parada from a bus line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.bus.22.parades.2608.json'));
            });

            api.transit.linies.bus(22).parades(2608).then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/bus/22/parades/2608');
                expect(response.totalFeatures).toBe(2);
                response.features.forEach(function(feature) {
                    expect(feature.properties.CODI_PARADA).toBe(2608);
                });
                done();
            }
        });

        it("should get one parada from its identifier, even if not bound to any line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.parades.2.json'));
            });

            api.transit.parades(2).then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/parades/2');
                expect(response.totalFeatures).toBe(1);
                response.features.forEach(function(feature) {
                    expect(feature.properties.CODI_PARADA).toBe(2);
                });
                done();
            }
        });
    });

    describe("Get Metro Estacions", function() {
        var api;

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);
        });

        it("should get all estacions from a line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.metro.2.estacions.json'));
            });

            api.transit.linies.metro(2).estacions().then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/metro/2/estacions/');
                expect(response.totalFeatures).toBe(18);
                done();
            }
        });

        it("should get one estacio from a metro line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.metro.2.estacions.213.json'));
            });

            api.transit.linies.metro(2).estacions(213).then(handleSuccess, fail);

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

    describe("Get Correspondencies i Accessos", function() {
        var api;

        beforeEach(function() {
            api = tmb(keys.app_id, keys.app_key);
        });

        it("should get all correspondencies for a Bus Stop on a line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.bus.22.parades.2878.corresp.json'));
            });

            api.transit.linies.bus(22).parades(2878).corresp.then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/bus/22/parades/2878/corresp');
                expect(response.totalFeatures).toBe(8);
                done();
            }
        });

        it("should get all correspondencies for a Bus Stop regardless its belonging to a line", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.parades.2.corresp.json'));
            });

            api.transit.parades(2).corresp.then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/parades/2/corresp');
                expect(response.totalFeatures).toBe(0);
                done();
            }
        });

        it("should get all correspondencies for a Metro Station", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.metro.2.estacions.213.corresp.json'));
            });

            api.transit.linies.metro(2).estacions(213).corresp.then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/metro/2/estacions/213/corresp');
                expect(response.totalFeatures).toBe(29);
                done();
            }
        });

        it("should get all accessos for a Metro Station", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.metro.2.estacions.213.accessos.json'));
            });

            api.transit.linies.metro(2).estacions(213).accessos().then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/metro/2/estacions/213/accessos/');
                expect(response.totalFeatures).toBe(2);
                done();
            }
        });

         it("should get a particular acces for a Metro Station", function(done) {
            spyOn(api.http, 'get').and.callFake(function() {
                return Promise.resolve(readJSON('spec/fixtures/transit.linies.metro.2.estacions.213.accessos.21301.json'));
            });

            api.transit.linies.metro(2).estacions(213).accessos(21301).then(handleSuccess, fail);

            function handleSuccess(response) {
                expect(api.http.get).toHaveBeenCalledWith('transit/linies/metro/2/estacions/213/accessos/21301');
                expect(response.totalFeatures).toBe(1);
                done();
            }
        });

    });

});

/**
 * Created by michogarcia on 17/03/16.
 */
describe("tmb.js spec:", function() {
    var tmb = require('../src/tmb');
    var keys = readJSON('api_keys.json');
    var api = tmb(keys.app_id, keys.app_key);

    it("should have a hello world function returning id and key", function() {
        var greeting = api.helloWorld;
        expect(greeting).toBeTruthy();
        expect(greeting).toContain(keys.app_id);
        expect(greeting).toContain(keys.app_key);
    });

    it("should make real HTTP calls and get something in response", function(done) {
        api.search.query("catalunya").then(function(response) {
            expect(response.page.totalRecords).toBeGreaterThan(0);
            done();
        }, fail)
    });
});

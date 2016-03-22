/**
 * Created by michogarcia on 17/03/16.
 */
var IN_NODE = (typeof module === 'object' && module.exports);

if (IN_NODE) {
    // Load module under test.
    var tmb = require('../src/tmb.js');
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

    // it("should search for a term and return something", function(done) {
    //     function testResponse(data) {
    //         expect(data).toBeTruthy();
    //         done();
    //     }
    //
    //     api.search("catalunya").then(testResponse, done.fail);
    // })
});

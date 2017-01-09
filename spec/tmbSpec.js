describe("tmb.js spec:", function() {
    var tmb = require('../src/tmb');

    it("API v2 should use app_id and app_key credentials", function(done) {
        var keys = readJSON('api_keys.json');
        var api_v1 = tmb(keys.app_id, keys.app_key);

        api_v1.search.query("catalunya").then(function(response) {
            expect(response.page.totalRecords).toBeGreaterThan(0);
            done();
        }, fail);
    });

    it("API v3 should use an auth0 token requested by delegation", function(done) {
        var axios = require('axios');
        var test_user = readJSON('auth0_user.json');

        axios.post('https://tmb.eu.auth0.com/oauth/ro', {
            connection: "Username-Password-Authentication",
            grant_type: "password",
            client_id: test_user.client_id,
            username: test_user.username,
            password: test_user.password,
            scope: "openid"
        }).then(createApi).catch(function(cause) {
            console.log(cause);
            fail(JSON.stringify(cause,null,2));
        });

        function createApi(response) {
            var id_token = response.data.id_token;
            if(!id_token) fail(response.data);
            tmb.v3(test_user.client_id, id_token).then(search);
        }

        function search(api_v3) {
            api_v3.search.query("catalunya").then(parse, fail);
        }

        function parse(response) {
            expect(response.page.totalRecords).toBeGreaterThan(0);
            done();
        }
    });
});

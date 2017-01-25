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

        var getAppToken = axios.post('https://tmb.eu.auth0.com/oauth/ro', {
            connection: "Username-Password-Authentication",
            grant_type: "password",
            client_id: test_user.client_id,
            username: test_user.username,
            password: test_user.password,
            scope: "openid email api version"
        });

        getAppToken.then(getApi).then(search).then(parse).catch(showError);

        function getApi(response) {
            var id_token = response.data.id_token;
            if(!id_token) fail(response.data);
            return tmb.v3(test_user.client_id, id_token);
        }

        function search(api_v3) {
            return api_v3.search.query("catalunya").catch(showError);
        }

        function parse(response) {
            expect(response.page.totalRecords).toBeGreaterThan(0);
            done();
        }

        function showError(response) {
            fail(JSON.stringify(response,null,2));
        }

    });
});

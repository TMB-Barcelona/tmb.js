'use strict';
var Page = function(request, response, query) {
    // Set a default request object
    if(!request) request = {};
    if(!request.hasOwnProperty('text')) request.text = "";
    if(!request.hasOwnProperty('options')) request.options = {};
    if(!request.options.hasOwnProperty('resultsPerPage')) request.options.resultsPerPage = 20;

    // Check response object has required properties
    if(!response || !response.hasOwnProperty('numFound') || !response.hasOwnProperty('start')
                 || !response.hasOwnProperty('docs') || !response.docs.hasOwnProperty('length'))
        throw new Error("Not a valid search response");

    var newPage = function(test, number) {
        return function() {
            console.log(test, number);
            if(test) {
                var options = Object.create(request.options);
                options.page = number;
                return query(request.text, options);
            } else {
                return Promise.resolve(Page(request, response, query));
            }
        }
    };

    var page = {
        number: (response.start / request.options.resultsPerPage) + 1,
        total: response.numFound,
        from: response.start + 1,
        to: response.start + response.docs.length
    };

    page.isFirst = page.number == 1;
    page.isLast = page.to == page.total;
    page.hasPrev =  !page.isFirst;
    page.hasNext = !page.isLast;
    page.first = newPage(page.hasPrev, 1);
    page.prev = newPage(page.hasPrev, page.number-1);
    page.next = newPage(page.hasNext, page.number+1);
    page.last = newPage(page.hasNext, Math.ceil(page.total/request.options.resultsPerPage));

    return {
        request: request,
        page: page,
        items: response.docs
    };

};

module.exports = Page;

# tmb.js

[![Build Status](https://travis-ci.org/geomatico/tmb.js.svg?branch=develop)](https://travis-ci.org/geomatico/tmb.js)

TMB API Javascript library


## Common tasks

* Install dependencies and development API keys: ``npm install``.
* Test: ``npm test``.
* Build: ``npm run build`` and check the ``dist/`` directory.
* Run examples: ``npm start`` and open http://localhost:8080/webpack-dev-server/examples/


## Usage

[If needed](https://developer.mozilla.org/ca/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility), polyfill ``es6-promise``.
Then, include the built ``dist/tmb.js`` library, and instantiate with your API keys. A full example:

```html
<html>
<head>
	<script type="text/javascript" src="node_modules/es6-promise/dist/es6-promise.js"></script>
	<script type="text/javascript" src="dist/tmb.js"></script>
	<script type="text/javascript">

		// Instantiate with user keys
		var api = tmb('<your_app_id>', '<your_app_key>');

		// Alternatively, indicate a JSON file location (URL) containing: {"app_id":"<your_app_id>","app_key":"<your_app_key>"}
		var api_2 = tmb("path/to/api_keys.json");

		// Display a greeting message
		console.log(api.helloWorld);
	</script>
</head>
<body>
</body>
</html>
```

## Search

* Basic query:

```javascript
api.search.query("catalunya").then(responseCallback); // Query and return a Promise
```

* The paged results object:

```javascript
function responseCallback(result) {
    // 'items' is an array with the n'th page of results (defaults to 20 results per page):
    numResults = result.items.length;
    
    // 'request' contains details about the query:
    result.request.text; // "catalunya"
    result.request.options.resultsPerPage; // 20 by default.
    
    // 'page' contains metadata about the paging:
    result.page.isFirst; // boolean, indicates if this is the first page of results.
    result.page.hasPrev; // boolean, indicates if there is a previous page of results.
    result.page.hasNext; // boolean, indicates if there are further pages of results.
    result.page.isLast;  // boolean, indicates if this is the last page of results.
    result.page.number;  // page number, starting with 1.
    result.page.totalPages; // total number of pages.
    result.page.from;    // Index of the first item in this page, with respect to the whole result set.
    result.page.to;      // Index of the last item in this page, with respect to the whole result set.
    
    // And also methods to jump through pages, which in turn return a new paged results Promise, just like the original query:
    pagedResults.page.first().then(responseCallback); // Jump to the first page of results.
    pagedResults.page.prev().then(responseCallback); // Jump to the previous page of results.
    pagedResults.page.next().then(responseCallback); // Jump to the next page of results.
    pagedResults.page.last().then(responseCallback); // Jump to the last page of results.
}
```

* Other search options:

```javascript
var options = {
    resultsPerPage: 15, // Set the number of results per page for this query
    entitats: [api.search.ENTITATS.ESTACIONS, api.search.ENTITATS.LINIES], // Show only results for estacions and línies.
    detail: true // Result items will contain extra proerties, such as geometries.
}

api.search.query("catalunya", options).then(responseCallback);
```

All possible values for ``api.search.ENTITATS`` are: ``LINIES``, ``INTERCANVIADORS``, ``PARADES``, ``ESTACIONS`` and ``ACCESSOS``.

* Changing default options:

If you want to change the default results per page for any future queries, use the global property:

```javascript
api.search.config.resultsPerPage = 50;
```


## Transit

Again, queries to the API return a Promise:

```javascript
// Get all linies
api.transit.linies().info().then(parseLinies);

// Get linies with a specific CODI_LINIA 
api.transit.linies(22).info().then(parseLinies);

// Get all parades
api.transit.linies(22).parades().then(parseParades);

// Get parades with a specific CODI_PARADA
api.transit.linies(22).parades(2608).then(parseParades);

// Get all estacions
api.transit.linies(2).estacions().then(parseEstacions);

// Get estacions with a specific CODI_GRUP_ESTACIO
api.transit.linies(2).estacions(213).then(parseEstacions);
```

Responses are GeoJSON FeatureCollections, which look like this:

```json
{
   "type":"FeatureCollection",
   "totalFeatures":1,
   "features":[
      {
         "type":"Feature",
         "id":"PARADES_ACTIVES.fid--48e04d30_1556e4280bf_-267e",
         "geometry":{
            "type":"Point",
            "coordinates":[
               2.159241480332353,
               41.42154697182292
            ]
         },
         "geometry_name":"GEOMETRY",
         "properties":{
            "ID_PARADA":687695,
            "CODI_PARADA":1244,
            "NOM_PARADA":"Montserrat de Casanovas-Passerell",
            "DESC_PARADA":"Montserrat De Casano/Arbós ",
            "CODI_INTERC":null,
            "NOM_INTERC":null,
            "NOM_TIPUS_PARADA":"PALFIX",
            "DESC_TIPUS_PARADA":"Parada Palfix",
            "TIPIFICACIO_PARADA":"N",
            "ADRECA":"Montserrat de Casanovas, 204",
            "ID_POBLACIO":748,
            "NOM_POBLACIO":"Barcelona",
            "ID_DISTRICTE":627,
            "NOM_DISTRICTE":"Horta-Guinardó",
            "DATA_INICI":"2012-03-12Z",
            "DATA_FI":null,
            "NOM_VIA":"Carrer de Montserrat de Casanovas",
            "NOM_PROPERA_VIA":"Carrer d'Arbós"
         }
      }
   ],
   "crs":{
      "type":"name",
      "properties":{
         "name":"urn:ogc:def:crs:EPSG::4326"
      }
   }
}
```

A callback example:

```javascript
function parseParades(featureCollection) {
    featureCollecion.features.forEach(function(feature){
        console.log(feature.properties.CODI_PARADA); // would be CODI_LINIA if parsing linies, or CODI_ESTACIO_LINIA if parsing estacions
    });
}
```

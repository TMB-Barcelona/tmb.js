'use strict';

// A known pictogram
function picto(name) {
    return "//dl.dropboxusercontent.com/u/2368219/tmb_pictos/" + name + ".png";
}

// An ugly placeholder
function placeholder(size, bg_color, fg_color, text) {
    return "http://placehold.it/" + size.toString() + "/" + bg_color + "/" + fg_color + "?text=" + text;
}

var icon = {
    search: function(results) {
        if (results.hasOwnProperty("docs")) {
            results.docs.forEach(function(result) {
                if (result.hasOwnProperty('icona')) {
                    // Defaults to an ugly placeholder
                    result.icona = placeholder(19, "0000FF", "FFFFFF", result.icona);

                    // Apply pictos for some known cases
                    if (result.icona == "Bus-Parada") {
                        result.icona = picto("BUS");
                    } else if (result.icona == "Bus-Interc") {
                        result.icona = picto("INTERC");
                    } else if (result.entitat == "Línies" && (result.tipus == "Vertical" || result.tipus == "Horitzontal" )) {
                        result.icona = picto("NXB");
                    } else if (result.icona == "FM") {
                        result.icona = picto(result.icona);
                    } else if (result.entitat == "Línies" && result.tipus == "Metro") {
                        result.icona = picto(result.icona);
                    }
                }
            });
        }
        return results;
    },
    estacions: function(estacions) {
        estacions.features.forEach(function(estacio) {
            estacio.properties.icona = picto(estacio.properties.PICTO);
        });
        return estacions;
    },
    parades: function(parades) {
        parades.features.forEach(function(parada) {
            parada.properties.icona = placeholder(19, parada.properties.COLOR_REC, "FFFFFF", parada.properties.NOM_LINIA);
        });
        return parades;
    }
};

module.exports = icon;

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
                    var url = placeholder(19, "0000FF", "FFFFFF", result.icona);

                    // Apply pictos for some known cases
                    if (result.icona == "Bus-Parada") {
                        url = picto("BUS");
                    } else if (result.icona == "Bus-Interc") {
                        url = picto("INTERC");
                    } else if (result.entitat == "Línies" && (result.tipus == "Vertical" || result.tipus == "Horitzontal" )) {
                        url = picto("NXB");
                    } else if (result.icona == "FM") {
                        url = picto(result.icona);
                    } else if (result.entitat == "Línies" && result.tipus == "Metro") {
                        url = picto(result.icona);
                    } else if (result.entitat = "Estacions") {
                        url = picto(result.icona);
                    }

                    result.icona = url;
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
            if (parada.properties.hasOwnProperty("NOM_LINIA")) {
                parada.properties.icona = placeholder(19, parada.properties.COLOR_REC, "FFFFFF", parada.properties.NOM_LINIA);
            }
        });
        return parades;
    }
};

module.exports = icon;

function cleanArray(array) {
    return array.filter((data) => {
        return data.trim() != ''
    })
}

function isValidDate(month, day) {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return (month >= 1 && month <= 12) && (day >= 1 && day <= daysInMonth[month - 1]);
}

function numCommemorations(array) {
    let num = 0;

    for (let i = 0; i < array.length; i++) {
        if (array[i] == "Orémus.") {
            num = num + 1;
        }
    }

    return num;
}

function getCommemoration(array) {
    return {
        feast: array[0].trim(),
        class: array[1].trim()
    }
}

function getIntroit(introit) {
    return [
        {
            source: introit[1],
            text: introit[2]
        },
        {
            source: introit[3],
            text: introit[4]
        }
    ]
}

function getOpeningPrayer(oratio) {
    const num_oremus = numCommemorations(oratio);
    
    if (num_oremus == 1) {
        return [
            {
                "prayer": oratio[5] + " " + oratio[6],
                "response": oratio[7]
            }
        ]
    }
    else {
        return [
            {
                "prayer": oratio[5] + " " + oratio[6],
                "response": oratio[7]
            },
            {
                "commemoration": oratio[10],
                "prayer": oratio[9] + " " + oratio[11],
                "response": oratio[7]
            }
        ]
    }
}

function getEpistle(epistle) {
    return {
        "source": epistle[2],
        "text": epistle[1] + " " + epistle[3]
    }
}

// FIX THIS FUNCTION FOR JUNE 1, 2019
function getGradual(gradual) {
    let propers = {};

    // Easter and Pentecost
    if (gradual.indexOf("Sequentia ") != -1) {
        propers['gradual'] = {
            "source": gradual[2],
            "text": gradual[1] + " " + gradual[3] + " " + gradual[4]
        }

        let sequentiaStart = gradual.indexOf("Sequentia ") + 1;
        let sequentiaText = "";
        for (let i = sequentiaStart; i < gradual.length; i++) {
            sequentiaText += gradual[i] + " "
        }

        propers['sequentia'] = {
            "text": sequentiaText
        }
    }
    else {
        if (gradual.indexOf("Alleluia ") != -1) {
            propers['gradual'] = {
                "source": gradual[gradual.indexOf("Alleluia ") + 2],
                "text": gradual[gradual.indexOf("Alleluia ") + 3]
            }

            propers['tract'] = {
                "source": gradual[gradual.indexOf("Alleluia ") + 4],
                "text": gradual[gradual.indexOf("Alleluia ") + 5]
            }
        }
        else {
            propers['gradual'] = {
                "source": gradual[gradual.indexOf("Graduale ") + 1],
                "text": gradual[gradual.indexOf("Graduale ") + 2]
            }

            propers['tract'] = {
                "source": gradual[gradual.indexOf("Graduale ") + 3],
                "text": gradual[gradual.indexOf("Graduale ") + 4]
            }
        }

        if (gradual[3].startsWith("V.")) {
            propers['gradual']['text'] += " " + gradual[3]
        }
    }

    return propers;
}

function getGospel(evangelium) {
    return {
        "source": evangelium[10],
        "text": evangelium[11]
    }
}

function getOffertory(offertorium) {
    return {
        "source": offertorium[6],
        "text": offertorium[7]
    };
}

function getSecret(secreta) {
    return {
        "text": secreta[8]
    };
}

function getPreface(prefatio) {
    return {
        "mode": prefatio[8],
        "text": prefatio[9]
    }
}

function getCommunion(communio) {
    return {
        "source": communio[1],
        "text": communio[2]
    }
}

function getPostCommunion(postcommunio) {
    return {
        "text": postcommunio[6],
        "response": postcommunio[7]
    }
}

function isTriduum(day) {
    return (day['feast'].indexOf("Sabbato Sancto") != -1 || day['feast'].indexOf("Parasceve") != -1)
}

module.exports.cleanArray = cleanArray;
module.exports.isValidDate = isValidDate;
module.exports.numCommemorations = numCommemorations;
module.exports.getCommemoration = getCommemoration;
module.exports.getIntroit = getIntroit;
module.exports.getOpeningPrayer = getOpeningPrayer;
module.exports.getEpistle = getEpistle;
module.exports.getGradual = getGradual;
module.exports.getGospel = getGospel;
module.exports.getOffertory = getOffertory;
module.exports.getSecret = getSecret;
module.exports.getPreface = getPreface;
module.exports.getCommunion = getCommunion;
module.exports.getPostCommunion = getPostCommunion;
module.exports.isTriduum = isTriduum;
const config = require('./config.json');
const utils = require('./utils/utils');

const missa = require('request-promise');
const $ = require('cheerio');

function getMassData(month, day, year, num) {
    // Add parameter to accomodate for Christmas Day
    const missanumber = num || 1;
    const url = config['URL'] + '?date=' + month + '-' + day + '-' + year + "&missanumber=" + missanumber;

    return missa(url).then((html) => {
        let propers = {};

        // Saint / Feast of the Day
        const commemoration = utils.cleanArray($("form p:nth-of-type(1) font:nth-of-type(1)", html).text().split("~"));
        propers['commemoration'] = utils.getCommemoration(commemoration);

        // If Good Friday or Holy Saturday, return only the comemmoration
        // since no Mass is celebrated that day
        if (utils.isTriduum(propers['commemoration'])) {
            res.status(200).send(JSON.stringify(propers, null, 4));
        }
        else if (!utils.isValidDate(month, day)) {
            return new Promise((resolve, reject) => reject({ error: "Invalid date" }));
        }
        else if (num > 3) {
            if (month == 12 && day == 25) {
                return new Promise((resolve, reject) => reject({ error: "There can only be three Masses on Christmas Day." }));
            }
            else {
                return new Promise((resolve, reject) => reject({ error: "This flag should be kept to less than 3, and ideally used during Christmas Day (25 December)." }));
            }
        }
        else {
            // Introit
            const introit = utils.cleanArray($("td#L6:nth-of-type(1) font[color='black']", html).text().split("\n"));
            propers['introit'] = utils.getIntroit(introit);
        
            // Opening Prayer
            const oratio = utils.cleanArray($("td#L9:nth-of-type(1) font[color='black']", html).text().split("\n"))
            propers['oratio'] = utils.getOpeningPrayer(oratio);
        
            // Epistle
            const epistle = utils.cleanArray($("td#L10:nth-of-type(1) font[color='black']", html).text().split("\n"));
            propers['epistle'] = utils.getEpistle(epistle);
            
            // Gradual and Tract
            const gradual = utils.cleanArray($("td#L11:nth-of-type(1) font[color='black']", html).text().split("\n"));
            const gradPropers = utils.getGradual(gradual);
            const gradKeys = Object.keys(gradPropers);
            
            for (let i = 0; i < gradKeys.length; i++) {
                propers[gradKeys[i]] = gradPropers[gradKeys[i]]
            }
        
            // Gospel
            const evangelium = utils.cleanArray($("td#L12:nth-of-type(1) font[color='black']", html).text().split("\n"));
            propers['gospel'] = utils.getGospel(evangelium);
        
            // Offertory
            const offertorium = utils.cleanArray($("td#L14:nth-of-type(1) font[color='black']", html).text().split("\n"));
            propers['offertory'] = utils.getOffertory(offertorium);
        
            // Secret 
            const secreta = utils.cleanArray($("td#L20:nth-of-type(1) font[color='black']", html).text().split("\n"));
            propers['secret'] = utils.getSecret(secreta);
        
            // Preface 
            const prefatio = utils.cleanArray($("td#L21:nth-of-type(1) font[color='black']", html).text().split("\n"));
            propers['preface'] = utils.getPreface(prefatio);
        
            // Communion
            const communio = utils.cleanArray($("td#L49:nth-of-type(1) font[color='black']", html).text().split("\n"));
            propers['communion'] = utils.getCommunion(communio);
        
            // Postcommunion
            const postcommunio = utils.cleanArray($("td#L50:nth-of-type(1) font[color='black']", html).text().split("\n"));
            propers['postcommunion'] = utils.getPostCommunion(postcommunio);
        
            return new Promise((resolve, reject) => resolve(JSON.stringify(propers, null, 4)))
        }    
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = getMassData;


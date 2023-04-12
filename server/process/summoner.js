const hook = require("../process/hook")
const fs = require("fs")
const https = require("https")

const lcu = hook.find_client_backend

const summonerId = async (callback) => {
    https.get({
        host: lcu.hostname,
        port: lcu.port,
        path: "/lol-summoner/v1/current-summoner",
        headers: {
            Authorization: "Basic " + lcu.lcu_api_key
        },
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        cert: fs.readFileSync("./riot.pem")
    }, (response) => {
        let data = '';

        // A chunk of data has been received.
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        response.on('end', () => {
            console.log(data);
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        })
    })
}

const PUUID = async (callback) => {

}

module.exports = { summonerId, PUUID }
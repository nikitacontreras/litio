const hook = require("../process/hook")
const fs = require("fs")
const util = require('util')
const https = require("https")

const lcu = hook.find_client_backend()

const summonerId = async (callback) => {
    return new Promise((resolve) => {
        lcu.then(res => {
            https.get({
                host: "127.0.0.1",
                port: res.port,
                path: "/lol-summoner/v1/current-summoner",
                headers: {
                    Authorization: "Basic " + res.api_key
                },
                rejectUnauthorized: false,
                requestCert: true,
                agent: false,
                cert: fs.readFileSync("./riot.pem").toString()
            }, (response) => {
                let data = '';

                // A chunk of data has been received.
                response.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                response.on('end', () => {
                    resolve(JSON.parse(data));
                }).on("error", (err) => {
                    throw new Error({
                        error: "ECONNREFUSED",
                        message: err
                    })
                })
            })
        })
    })
}

const riotPoints = async (callback) => {
    return new Promise((resolve) => {
        lcu.then(res => {
            https.get({
                host: "127.0.0.1",
                port: res.port,
                path: "/lol-inventory/v1/wallet/RP",
                headers: {
                    Authorization: "Basic " + res.api_key
                },
                rejectUnauthorized: false,
                requestCert: true,
                agent: false,
                cert: fs.readFileSync("./riot.pem").toString()
            }, (response) => {
                let data = '';

                // A chunk of data has been received.
                response.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                response.on('end', () => {
                    resolve(JSON.parse(data));
                }).on("error", (err) => {
                    throw new Error({
                        error: "ECONNREFUSED",
                        message: err
                    })
                })
            })
        })
    })
}

const blueEssence = async (callback) => {
    return new Promise((resolve) => {
        lcu.then(res => {
            https.get({
                host: "127.0.0.1",
                port: res.port,
                path: "/lol-inventory/v1/wallet/lol_blue_essence",
                headers: {
                    Authorization: "Basic " + res.api_key
                },
                rejectUnauthorized: false,
                requestCert: true,
                agent: false,
                cert: fs.readFileSync("./riot.pem").toString()
            }, (response) => {
                let data = '';

                // A chunk of data has been received.
                response.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                response.on('end', () => {
                    resolve(JSON.parse(data));
                }).on("error", (err) => {
                    throw new Error({
                        error: "NO_DATA_RECEIVED",
                        message: err
                    })
                })
            })
        })
    })
}


const acceptGame = async (callback) => {
    return new Promise((resolve) => {
        lcu.then(res => {
            https.request({
                host: "127.0.0.1",
                port: res.port,
                path: "/lol-matchmaking/v1/ready-check/accept",
                headers: {
                    Authorization: "Basic " + res.api_key
                },
                timeout: 1000,
                rejectUnauthorized: false,
                requestCert: true,
                agent: false,
                cert: fs.readFileSync("./riot.pem").toString()
            }, (response) => {
                response.write(response.statusCode);
                console.log('statusCode:', res.statusCode);
                console.log('headers:', res.headers);
                let data = '';

                // A chunk of data has been received.
                response.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                response.on('end', () => {
                    resolve(JSON.parse(data));
                }).on("error", (err) => {
                    throw new Error({
                        error: "NO_DATA_RECEIVED",
                        message: err
                    })
                })
            })
        })
    })
}

module.exports = { summonerId, acceptGame, riotPoints, blueEssence }
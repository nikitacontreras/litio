const certURL = "https://static.developer.riotgames.com/docs/lol/riotgames.pem"
const { Router } = require('express');
const fs = require('fs');
const router = require("express").Router()
const moduleName = "/collections"

const getCert = async callback => {
    const file = fs.createWriteStream("riot.pem");
    const request = http.get(certURL, function (response) {
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                console.log("[SERVER/certs] Downloading riot.pem");
                response.pipe(file)
                console.log(response.pipe)

                file.on("finish", () => {
                    file.close();
                    console.log("[SERVER/certs] Download Completed");
                    callback()
                })
            }
        })
    })
}

router.use(async (req, res, next) => {
    getCert(() => {
        next()
    })
})


module.exports = { router }
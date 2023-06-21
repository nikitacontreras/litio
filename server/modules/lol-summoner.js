const router = require("express").Router()
const moduleName = "/summoner"
const hook = require("../process/hook")
const certs = require("../process/certs")
const { response } = require("express")

let lcu;

router.use(async (req, res, next) => {
    lcu = await hook.is_running()
    console.log(`[SERVER${moduleName}] Checking if LCU is open: ${lcu}`)
    if (lcu) {
        next()
    } else {
        console.log(`[ERROR] ${hook.find_client_backend.port}`)
        res.json({ "error": "NO_LCU_OPEN" })
    }
})

router.get('/get', async (req, res) => {
    hook.lcu_hook("/lol-summoner/v1/current-summoner").then(response => {
        res.json(JSON.parse(response))
    })
})

module.exports = router
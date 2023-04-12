const router = require("express").Router()
const moduleName = "/collections"
const hook = require("../process/hook")
const summoner = require("../process/summoner")
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
    const response = await hook.lcu_hook("/lol-summoner/v1/current-summoner")
    console.log(`[SERVER${moduleName}] ${response}`)
    res.json({ "text": response })
})

module.exports = router
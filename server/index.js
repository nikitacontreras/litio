const path = require("path")
const express = require("express")
const asyncHandler = require("express-async-handler")
const os = require("os")
const { promisify } = require("util")

const lol_collections = require("./modules/lol-collections")
const lcu_hook = require("./process/hook")
const summoner = require("./process/summoner")
const lol_certs = require("./process/certs")


const PORT = process.env.PORT || 8080

const app = express()

//add client to run
app.use("/api/collections", lol_collections)
//app.use("/api/cert", lol_certs)
//app.use(express.static(path.resolve(__dirname, "../client/build")))

app.get("/client", async (req, res) => {
    console.log("[INFO] Calling /api/info/is_running...")
    const is_open = await lcu_hook.is_running()
    res.json({
        "os": os.platform(),
        "arch": os.arch(),
        "cpus": os.cpus(),
        "hostname": os.hostname(),
        "memory": os.totalmem()
    })
})

app.get("/api/info/is_running", async (req, res) => {
    console.log("[INFO] Calling /api/info/is_running...")
    const is_running = await lcu_hook.is_running()
    res.json({
        "is_running": is_running
    })
})

app.get("/api/game/accept", async (req, res) => {
    console.log("[INFO] Calling /api/game/accept...")
    const acceptGame = await summoner.acceptGame()
    res.json({
        "executed": true
    })
})


app.get("/api/info/client", async (req, res) => {
    console.log("[INFO] Calling /api/info/client...")
    const find_client_backend = await lcu_hook.find_client_backend()
    res.json(find_client_backend)
})

app.get("/api/info/user", async (req, res) => {
    console.log("[INFO] Calling /api/info/user...")
    const summonerID = await summoner.summonerId()
    const RP = await summoner.riotPoints()
    const blueEssence = await summoner.blueEssence()
    console.log(summonerID)
    res.json({
        username: summonerID.displayName,
        internalName: summonerID.internalName,
        RP: RP.RP,
        blueEssence: blueEssence.lol_blue_essence,
        level: summonerID.summonerLevel,
        summonerID: summonerID.summonerId,
        accountId: summonerID.accountId,
        puuid: summonerID.puuid,
    })
})

app.get('*', (req, res) => {
    res.json({ "error": "NO_ENDPOINT_AVAILABLE" })
});

app.listen(PORT, () => {
    console.log(`[SERVER] Opening backend @ port ${PORT}`)
    lcu_hook.riot_cert();
})


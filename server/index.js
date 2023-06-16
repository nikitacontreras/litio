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
//app.use("/api/collections", lol_collections)
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
    const is_open = await lcu_hook.is_running()
    res.json({
        "is_open": is_open
    })
})

app.get("/api/info/client", async (req, res) => {
    console.log("[INFO] Calling /api/info/client...")
    const is_open = await lcu_hook.find_client_backend()
    res.json(is_open)
})

app.get("/api/info/user", async (req, res) => {
    console.log("[INFO] Calling /api/info/user...")
    const is_open = await lcu_hook.find_client_backend()
    res.json(is_open)
})

app.get('*', (req, res) => {
    res.json({ "error": "NO_ENDPOINT_AVAILABLE" })
});

app.listen(PORT, () => {
    console.log(`[SERVER] Opening backend @ port ${PORT}`)
    summoner.summonerId();
})


const path = require("path")
const express = require("express")
const lcu_hook = require("./process/hook")
const asyncHandler = require("express-async-handler")
const { promisify } = require("util")

const lol_collections = require("./modules/lol-collections")
//const lol_certs = require("./process/certs")


const PORT = process.env.PORT || 8080

const app = express()

//add client to run
app.use("/api/collections", lol_collections)
//app.use("/api/cert", lol_certs)
//app.use(express.static(path.resolve(__dirname, "../client/build")))


app.get("/api/is_running", async (req, res) => {
    console.log("[INFO] Calling /api/is_running...")
    const is_open = await lcu_hook.is_running()
    res.json({ 
        "is_open": is_open 
    })
})

app.get('*', (req, res) => {
    res.json({ "error": "NO_ENDPOINT_AVAILABLE" })
    //res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[SERVER] Opening backend @ port ${PORT}`)
})


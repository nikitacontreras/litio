const fs = require("fs")
const path = require('path')
const http = require('http')
const https = require('https')
const find = require('find-process')


let lcu_port, lcu_rc_port, lcu_install_directory, lcu_api_key = ""

const riot_cert = async (callback) => {
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

const is_running = async (callback) => {
    const processList = await find('name', 'LeagueClientUx', true)
    const isRunning = processList.length > 0
    if (isRunning) {
        return true
    } else {
        return false
    }
}
const find_client_backend = async callback => {
    console.log("[SERVER] Looking for LeagueClientUx...")
    const processList = await find('name', 'LeagueClientUx', true)
    const isRunning = processList.length > 0

    if (isRunning) {
        lcu_port = processList[0]["cmd"].match(/(?<=--app-port=).*?(?="\s)/).toString()
        lcu_rc_port = processList[0]["cmd"].match(/(?<=--riotclient-app-port=).*?(?="\s)/).toString()
        lcu_install_directory = processList[0]["cmd"].match(/(?<=--install-directory=).*?(?="\s)/).toString()
        lcu_api_key = btoa("riot:" + processList[0]["cmd"].match(/(?<=--remoting-auth-token=).*?(?="\s)/).toString())
        console.log(`[SERVER] Found LeagueClientUx running on port (${lcu_port})`)

        return {
            hostname: "127.0.0.1",
            port: lcu_port,
            riot_port: lcu_rc_port,
            lol_path: lcu_install_directory,
            api_key: lcu_api_key,
            api_key_clean: processList[0]["cmd"].match(/(?<=--remoting-auth-token=).*?(?="\s)/).toString()
        }

    } else {
        console.log("[ERROR] LeagueClientUx not running")
        return "LCU not running"
    }
    //const port = strings.process_regex(processList[0]["cmd"], "app-port")

}

const find_game_backend = async (callback) => {
    find('name', 'League of Legends', true)
        .then(function (list) {
            //const port = strings.process_regex(list[0]["cmd"], "app-port")
            return (list[0]["cmd"]);
        })
}

const lcu_hook = async (api_endpoint, _callback) => {
    lcu = await find_client_backend()
    console.log(`[SERVER/hook] Executing ${api_endpoint}`)
    https.get({
        host: lcu.hostname,
        port: lcu.port,
        path: api_endpoint,
        headers: {
            Authorization: "Basic " + lcu.api_key
        },
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        cert: fs.readFileSync(path.resolve(__dirname, "../src/riotgames.pem"))
    }, (response) => {
        let data = '';

        // A chunk of data has been received.
        response.on('data', (chunk) => {
            data += chunk;
        })

        // The whole response has been received. Print out the result.
        response.on('end', () => {
            console.log(typeof(data))
            return (data)
        }).on("error", (err) => {
            return (err.message)
        })
    })
}



module.exports = { riot_cert, find_client_backend, find_game_backend, lcu_hook, is_running }
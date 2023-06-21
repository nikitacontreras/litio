const fs = require("fs")
const path = require('path')
const http = require('http')
const https = require('https')
const find = require('find-process')
const os = require("os")

let lcu_port, lcu_rc_port, lcu_install_directory, lcu_api_key = ""

const riot_cert = async (callback) => {
    const file = fs.createWriteStream("riot.pem");
    const request = http.get("http://static.developer.riotgames.com/docs/lol/riotgames.pem", function (response) {
        response.pipe(file)
        file.on("finish", () => {
            file.close();
            console.log("[SERVER/certs] Download Completed");
        })
    })
}

const is_running = async (callback) => {
    let processList, isRunning;
    switch (os.platform()) {
        case "darwin":
            pidList = await find('name', 'League of Legends', true)
            pidList.forEach((item) => {
                if (item.bin.endsWith("LeagueClientUx")) {
                    processList = item
                }
            });
            isRunning = processList ? Object.keys(processList).length > 0 : false
            break;
        default:
            processList = await find('name', 'LeagueClientUx', true)
            isRunning = processList.length > 0
    }
    return isRunning ? true : false
}
const find_client_backend = async callback => {
    console.log("[SERVER] Looking for LeagueClientUx...")
    let processList, isRunning;
    switch (os.platform()) {
        case "darwin":
            pidList = await find('name', 'League of Legends', true)
            pidList.forEach((item) => {
                if (item.bin.endsWith("LeagueClientUx")) {
                    processList = item
                }
            });
            isRunning = processList ? Object.keys(processList).length > 0 : false
            break;
        default:
            processList = await find('name', 'LeagueClientUx', true)
            isRunning = processList.length > 0
    }

    if (isRunning) {
        switch (os.platform()) {
            case "darwin":
                lcu_port = processList.cmd.match(/(?<=--app-port=).*?(?=\s)/).toString()
                lcu_rc_port = processList.cmd.match(/(?<=--riotclient-app-port=).*?(?=\s)/).toString()
                lcu_install_directory = processList.cmd.match(/(?<=--install-directory=).*?(?=\s)/).toString()
                lcu_api_key = btoa("riot:" + processList.cmd.match(/(?<=--remoting-auth-token=).*?(?=\s)/)).toString()
                break;
            default:
                lcu_port = processList[0]["cmd"].match(/(?<=--app-port=).*?(?="\s)/).toString()
                lcu_rc_port = processList[0]["cmd"].match(/(?<=--riotclient-app-port=).*?(?="\s)/).toString()
                lcu_install_directory = processList[0]["cmd"].match(/(?<=--install-directory=).*?(?="\s)/).toString()
                lcu_api_key = btoa("riot:" + processList[0]["cmd"].match(/(?<=--remoting-auth-token=).*?(?="\s)/).toString())
        }

        console.log(`[SERVER] Found LeagueClientUx running on port (${lcu_port})`)
        return {
            hostname: os.hostname(),
            os: os.platform(),
            port: lcu_port,
            riot_port: lcu_rc_port,
            lol_path: lcu_install_directory,
            api_key: lcu_api_key,

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
    return new Promise((resolve) => {
        https.get({
            host: "127.0.0.1",
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
            console.log("executed")
            // A chunk of data has been received.
            response.on('data', (chunk) => {
                data += chunk;
            })
    
            // The whole response has been received. Print out the result.
            response.on('end', () => {
                console.log("done", data)
                resolve(data)
            }).on("error", (err) => {
                resolve(err.message)
            })
        })
    })
    
}

const gameOverflow = async (callback) => {
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



module.exports = { riot_cert, find_client_backend, find_game_backend, lcu_hook, is_running }
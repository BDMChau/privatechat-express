// Run this file to spawn child process for 
// client and server of privatechat-expressjs-github application
const { spawn } = require('child_process');

const path_server ="./server_nodejs_expressjs";
const path_client = "./client_reactjs";

const child_server = spawn("node", ["server.js"], { "cwd": path_server });
const child_client = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", ["run", "dev"], { "cwd": path_client });

console.log(child_client.pid)
console.log(child_server.pid)

// client
child_client.stdout.on("data", (data) => {
    console.log("Client: ", data.toString())
})

child_client.stderr.on("data", (data) => {
    console.log("Error client: ", data.toString())
})

child_client.on('close', (code) => {
    console.log(`child client process exited with code ${code}`);
});

// server
child_server.stdout.on("data", (data) => {
    console.log("server: ", data.toString())
})

child_server.stderr.on("data", (data) => {
    console.log("Error server: ", data.toString())
})

child_server.on('close', (code) => {
    console.log(`child server process exited with code ${code}`);
});



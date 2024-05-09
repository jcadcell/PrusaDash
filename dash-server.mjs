// dash-server.mjs
import { createServer } from 'node:http';
import { readFile } from 'fs/promises';

// https://www.npmjs.com/package/digest-fetch
//import DigestClient from "digest-fetch"
// https://axios-digest-auth.mhoc.co/
//import AxiosDigestAuth from "@mhoc/axios-digest-auth";
//const AxiosAuth = AxiosDigestAuth.default;
//https://www.npmjs.com/package/@lukesthl/ts-axios-digest-auth
// import { AxiosDigestAuth } from '@lukesthl/ts-axios-digest-auth';
//https://www.npmjs.com/package/urllib
//import  { request } from 'urllib';

var time=0;

// Load initial data
let data = JSON.parse(await readFile("devices-example.json", "utf8"));
// let data = [
    // {
    //     id:200,
    //     url:"http://192.168.1.40/",
    //     name:"JB-02",
    //     user:"maker",
    //     pass:"",
    //     status:"?",
    //     lastContact: time
    // },
//     {
//         id:1,        
//         url:"http://192.168.1.239/",
//         name:"MINI 1",
//         user:"maker",
//         pass:"",
//         status:"?",
//         lastContact: time
//     },
//     {
//         id:2,        
//         url:"http://192.168.1.170/",
//         name:"MINI 2",
//         user:"maker",
//         pass:"",
//         status:"?",
//         lastContact: time
//     },
//     {
//         id:31,        
//         url:"http://192.168.1.122/",
//         name:"MINI 31",
//         user:"maker",
//         pass:"",
//         status:"?",
//         lastContact: time
//     },
// ]

// Checks the URL and updates the status with the result
async function updateData(device) {
    console.log(`Checking ${device.name} at ${device.url}`)
    try {
        const response = await fetch(device.url);
        //console.log("RESPONSE")
        //console.log(response)

        if (response.ok) {
            //console.log('Promise resolved and HTTP status is successful for ' + device.name);
            // ...do something with the response
            device.status = '✓'
            device.lastContact = time

            // // Connect for real 
            // const options = {
            //     logger:console,
            //     algorithm: 'SHA-512-256-sess'
            // } 
            // const client = new DigestClient(device.user, "dZaCQBWfBUofhVj", options )//device.pass) 
            // //client.fetch(device.url + '/api/v1/status', options)
            // const resp = await client.fetch('http://192.168.1.40/api/v1/status', options)
            // console.log(resp.headers)
            // console.log(resp.status)
            // console.log(resp.statusText)
            // console.log(await resp.text())
            // //const json = resp.json()
            // //device.status = json.printer.state
            // //console.log(json)
            
            // const digestAuthClient = new AxiosDigestAuth({
            //     username: 'maker',
            //     password: 'dZaCQBWfBUofhVj',
            // });
              
            // const resp = await digestAuthClient.get('http://192.168.1.40/api/v1/status');
            // console.log(resp.headers)
            // console.log(resp.status)
            // console.log(resp.statusText)
            // console.log("post resp")

            // const options = {
            //     digestAuth: 'maker:dZaCQBWfBUofhVj'
            // }
            // const { data, res } = await request('http://192.168.1.40/api/v1/status');
            // console.log(data)
            // console.log(res)
            // //console.log(resp.statusText)
            // console.log("post resp")

        } else {
            // Custom message for failed HTTP codes
            if (response.status === 404) throw new Error('404, Not found');
            if (response.status === 500) throw new Error('500, internal server error');
            // For any other server error
            device.status = '✗'
            throw new Error(response.status);
        }
    } catch (error) {
        console.log("ERROR")
        console.log(error)
        device.status = '✗'
        //console.error('Fetch', error);
    }
}

// Check servers for status, updating data array
function refresh() {
    for (let i=0; i<data.length; i++) {
       updateData(data[i])
    }
    time++
    setTimeout(refresh, 5000)
}

// Initial call
refresh()

const server = createServer((req, res) => {
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5500'
});
  // Set to port where PrusaDash.html is served 'Access-Control-Allow-Origin': 'http://127.0.0.1:5500'
  res.end(JSON.stringify(data));
});

// starts a simple http server locally
// This determines the port where dash-server.mjs is running
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});
// run with `node dash-server.mjs`
const express = require('express')
const bodyParser = require('body-parser')
const sql = require('mssql')
const requestIp = require('request-ip')

const app = express()
const port = process.env.PORT || 5000;

const os = require('os');
const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Get the IP address from the request headers
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Respond with the IP address
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Your IP address is ${ip}`);

    // Log the IP address to the console
    console.log(`Client IP address: ${ip}`);
});

//console.log("Computer Name:", os.hostname());

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false })); // Remove 
app.use(express.urlencoded({ extended: true })); // New
// Parse application/json
// app.use(bodyParser.json()); // Remove
app.use(express.json()); // New

const pool = new sql.ConnectionPool({
    connectionLimit: 10,
    user: 'sa',
    password: '2017SKS**',
    server: 'JiratPC',
    database: 'FinalSPC',
    synchronize: true,
    trustServerCertificate: true,
    requestTimeout: 320000,
})

// Get all beers
app.get('/getuser', (req, res) => {
    pool.connect((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('select * from dbo.username_pass', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from beer table are: \n', rows)
        })
    })
})

app.get('/getmypc', (req, res) => {
    res.send({ MyPc: os.hostname() })
})

app.get('/get-ip', (req, res) => {
    var clientIp = requestIp.getClientIp(req)
    console.log(clientIp)
    res.send(`Your IP Address is ${clientIp}.`)
});

app.listen(port, () => console.log(`Listening on port ${port}`))
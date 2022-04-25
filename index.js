// Place your server entry point code here
// Require Minimist 
const args = require('minimist')(process.argv.slice(2))

// Make help, if --help or -h, echo help text to STDOUT & exit(0)
const help = (`
server.js [options]
--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help	Return this message and exit.
`)

if (args.help || args.h) {
  console.log(help)
  process.exit(0)
}

// Require Express, Morgan, fs, & cors
const express = require('express')
const app = express()
const morgan = require('morgan')
const fs = require('fs')
const cors = require('cors')
app.use(cors())

// Require Database
const db = require('./src/services/database.js')

// Require Routes

// Serve static HTML files
app.use(express.static('./public'));
// Make Express use its own built-in body parser to handle JSON
app.use(express.json());

args['port', 'debug', 'log', 'help']
// Set port, debug, log
const port = args.port || process.env.PORT || 5000
const debug = args.debug || process.env.debug || false
const log = args.log || process.env.log || true

if (log === true) {
    const WRITESTREAM = fs.createWriteStream('.data/log/access.log', {flags: 'a'})
    app.use(morgan('combined', {stream: WRITESTREAM}))
} else {
    console.log("Log file not created")
}

const server = app.listen(port, () => {
    console.log('App is running on port %PORT%'.replace('%PORT%',port))
});

app.get('/app/', (req, res, next) => {
    res.json({"message":"Your API works! (200)"})
    res.status(200)

});


if (debug === true) {
    app.get('/app/log/access', (req, res, next) => {
        const stmt = logdb.prepare('SELECT * FROM accesslog').all()
        res.status(200).json(stmt)
    })
    app.get('/app/error', (req, res, next) => {
        throw new Error("Error test successful.")
    })
}





















// Default response 
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});
import * as fs from "fs";

const express = require('express');
const app = express();
const port = 3000;

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
});

// -- Webserver started

// Datenbank
let accounts = null;
if (fs.existsSync("./dbase.json")) {
    // @ts-ignore
    accounts = JSON.parse(fs.readFileSync("./dbase.json"));
} else {
    accounts = {
        'a': 20_000,
        'b': 10_000,
        'c': 30_000,
    };
    fs.writeFileSync("./dbase.json", JSON.stringify(accounts));
}

// How much balance on :account ?
app.get('/balance/:account', (req, res) => {
    res.send("Balance: " + accounts[req.params.account] || 0);
});

// Transfer from :from to :to with amount :amount
app.post('/transfer/:from/:to/:amount', (req, res) => {
    const amount = parseInt(req.params.amount);

    if (accounts[req.params.from] < amount)
        return res.status(400).send("Insufficent funds");

    accounts[req.params.from] -= amount;
    accounts[req.params.to] = (accounts[req.params.to] || 0) + amount;

    // store in database
    fs.writeFileSync("./dbase.json", JSON.stringify(accounts));

    return res.send(true);
});

// Get database
app.get('/balances', (req, res) => {
    return res.send(accounts);
})


// Get Version
app.get('/version', (req, res) => {
    const package_ = require("./package.json");
    return res.send("Version: " + package_.version);
});


import * as fs from 'fs';
const express = require('express');
const app = express();

const database = 'central/database.json';
const port = 3000;

// Webserver started
app.listen(port, function() {
    console.log(
        `Example app listening at address http://localhost:${port}!\n`,
        { accounts: accounts }
    );
});

if (!fs.existsSync(database)) {
    fs.writeFileSync(database, JSON.stringify({ 'central': 20_000 }));
}
const accounts = JSON.parse(fs.readFileSync(database).toString());

// How much balance on :account ?
app.get('/balance/:account', (req, res) => {
    res.send('Balance: ' + accounts[req.params.account] || 0);
});

// Transfer from :from to :to with amount :amount
app.post('/transfer/:from/:to/:amount', (req, res) => {
    const amount = parseInt(req.params.amount);
    if (amount < 0)
        return res.status(400).send('Rejected - negative payment');
    if (!(req.params.from in accounts))
        return res.status(400).send('Rejected - account doesn\'t exist');
    if (accounts[req.params.from] < amount)
        return res.status(400).send('Rejected - insufficient funds');

    accounts[req.params.from] -= amount;
    accounts[req.params.to] = (accounts[req.params.to] || 0) + amount;

    // store in database
    fs.writeFileSync(database, JSON.stringify(accounts));

    return res.send(true);
});

// Get database
app.get('/balances', (req, res) => {
    return res.send(accounts);
})

// Get Version
app.get('/version', (req, res) => {
    const package_ = require('../package.json');
    return res.send('Version: ' + package_.version);
});

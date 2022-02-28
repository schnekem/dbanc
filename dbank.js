const express = require('express');
const app = express();
const port = 3000;

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});

// -- Webserver started

// Datenbank
const accounts = {
    'a': 200000
};

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

    return res.send(true);
});

// Get database
app.get('/balances', (req, res) => {
    return res.send(accounts);
})




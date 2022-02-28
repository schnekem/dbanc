const express = require('express');
const app = express();
const port = 3000;

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});

const accounts = {
    'a': 200000
};

app.get('/balance/:account', (req, res) => {
    res.send("Balance: " + accounts[req.params.account] || 0);
});

app.post('/transfer/:from/:to/:amount', (req, res) => {
    const amount = parseInt(req.params.amount);

    if (accounts[req.params.from] < amount)
        return res.status(400).send("Insufficent funds");

    accounts[req.params.from] -= amount;
    accounts[req.params.to] = (accounts[req.params.from] || 0) + amount;

    return res.send(true);
});

app.get('/balances', (req, res) => {
    return res.send(accounts);
})




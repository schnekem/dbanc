const express = require('express');
const app = express();
const fetch_ = require('node-fetch');

const url = `http://65.21.147.130:5000`
const bank_id = 'a';
const port = 3000;

const getCurrentBalances = async(bank_id) => {
    const payload = await fetch_(`${url}/balances`);
    return payload.json();
}

// Webserver started
app.listen(port, async function() {
    console.log(
        `Example app listening at address http://localhost:${port}!\n`,
        { accounts: await getCurrentBalances(bank_id) }
    );
});

/** How much balance on :account ?
 * @example curl http://localhost:3000/balance/a_a
 */
app.get('/balance/:account', async (req, res) => {
    const accounts = await getCurrentBalances(bank_id);
    return res.send('Balance: ' + accounts[req.params.account]);
});

/** Transfer from :from to :to with amount :amount
 * @example curl -X POST http://localhost:3000/transfer/a_a/a_b/1000
 */
app.post('/transfer/:from/:to/:amount', async (req, res) => {
    const amount = parseInt(req.params.amount);
    if (amount < 0)
        return res.status(400).send('Rejected - negative payment');

    const accounts = await getCurrentBalances(bank_id);
    const from = req.params.from;
    const to = req.params.to;

    if (!(from in accounts))
        return res.status(400).send('Rejected - account doesn\'t exist');
    if (accounts[from] < amount)
        return res.status(400).send('Rejected - insufficient funds');

    await fetch_(
        `${url}/transfer/${from}/${to}/${amount}`,
    {
            method: 'post',
            body: JSON.stringify({}),
            headers: {'Content-Type': 'application/json'}
        }
    );

    return res.send(true);
});

/** Get database
 * @example curl http://localhost:3000/balances
 */
app.get('/balances', async(req, res) => {
    const accounts = await getCurrentBalances(bank_id);
    return res.json(accounts);
})

/** Get version
 * @example curl http://localhost:3000/version
 */
app.get('/version', (req, res) => {
    const package_ = require('../package.json');
    return res.send('Version: ' + package_.version);
});

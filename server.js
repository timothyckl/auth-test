const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const port = 3000;

const users = [];

app.use(express.json());

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', async(req, res) => {
    try {
        const hashedPW = await bcrypt.hash(req.body.password, 10);
        const user = {
            username: req.body.username,
            password: hashedPW
        }
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

app.post('/users/login', async(req, res) => {
    const user = users.find(user => user.username == req.body.username);
    if (!user) res.status(500).send('Cannot find user');
    try {
        if (await bcrypt.compare(req.body.password, user.password))
            res.status(200).send('Success');
        else
            res.status(400).send('Failed');
    } catch {
        res.status(500).send('Failed');
    }
});

app.listen(port, _ => {
    console.log(`Server listening on port ${port}...`)
});
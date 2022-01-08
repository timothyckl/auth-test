const express = require('express');
const bcrypt = require('bcrypt');
const { verifyToken, signToken } = require('./auth/verifyToken');

const app = express();
const port = 3000;

const users = [];

app.use(express.json());

app.get('/users', verifyToken, (req, res) => {
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
        res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
});

app.post('/users/login', async(req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username == username);
    if (!user) res.status(500).send('Cannot find user');
    try {
        if (await bcrypt.compare(password, user.password)) {
            const accessToken = signToken({ username: username });
            res.status(200).json({ access_token: accessToken });
        } else
            res.status(400).send('Failed');
    } catch {
        res.status(500).send('Failed');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
});
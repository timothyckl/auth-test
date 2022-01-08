require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) res.sendStatus(401);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) res.sendStatus(403);
            req.user = user;
            next();
        });
    },
    signToken: (user) => {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    }
};
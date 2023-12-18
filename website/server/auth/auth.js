const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');

dotenv.config();

const authentication = async (req, res, next) => {
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    const tokenParts = authorizationHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(401).send({ auth: false, message: 'Invalid token format.' });
    }

    const token = tokenParts[1];

    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.decoded = decoded;
        req.user = decoded;
        next();
    });
};


module.exports = authentication;
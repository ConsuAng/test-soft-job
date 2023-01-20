require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getToken } = require('../helper/obtainToken');

const verifyToken = async (req, res, next) => {
	try {
		const token = getToken(req.header("Authorization"));
		jwt.verify(token, process.env.SECRET_KEY);
		next();
	} catch (error) {
		res.status(error.code || 498).send(error);
	}
};

module.exports = { verifyToken };
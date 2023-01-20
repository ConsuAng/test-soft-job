const express = require('express');
const cors = require("cors");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.APP_PORT || 4500;

const { checkCredentials } = require('./middlewares/checkCredentials');
const { reportQuery } = require('./middlewares/report');
const { verifyToken } = require('./middlewares/verifyToken');
const { getToken } = require('./helper/obtainToken');
const { newUser, userLogin, getProfile } = require('./services/consultas');

app.use(express.json()); //middleware para parsear el cuerpo de la consulta
app.use(cors());

app.get('/usuarios',reportQuery, verifyToken, async(req, res) => {
  try {
    const { email }= jwt.decode(getToken(req.header("Authorization")));
    console.log(email)
    const usuario = await getProfile(email);
    res.json(usuario)
  } catch (error) {
    console.log(error);
		res.status(error.code || 500).send(error);
  }
});

app.post('/usuarios',reportQuery, async (req, res) => {
  try {
    const user = req.body;
    await newUser(user);
    res.send('Usuario registrado con éxito');
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/login", reportQuery, checkCredentials, async (req, res) => {
  try {
    const { email, password } = req.body;
    await userLogin(email, password);
    const token = jwt.sign({ email }, process.env.SECRET_KEY);
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Estoy escuchando el puerto ${PORT}`);
});

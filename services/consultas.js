const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  allowExitOnIdle: true
});

const newUser = async (user) => {
  let { email, password, rol, lenguage } = user;
  const query = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)";
  const encryptedPassword = bcrypt.hashSync(password);
  password = encryptedPassword;
  const values = [email, encryptedPassword, rol, lenguage];
  await pool.query(query, values);
};

const userLogin = async (email, password) => {
  const values = [email]
  const consulta = "SELECT * FROM usuarios WHERE email = $1"
  const { rows: [usuario], rowCount } = await pool.query(consulta, values)
  const { password: passwordEncriptada } = usuario
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
  if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: "Email o contraseña incorrecta" }
};

const getProfile = async(email) => {
  const value = [email];
  const query = "SELECT * FROM usuarios WHERE email = $1";
  const result = await pool.query(query, value);
  const usuario = {
    email: result.rows[0].email,
    rol: result.rows[0].rol,
    lenguage: result.rows[0].lenguage
  }
  return usuario;
}

module.exports = { newUser, userLogin, getProfile };
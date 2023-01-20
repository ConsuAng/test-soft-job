const reportQuery = async(req, res, next) => {
    const parametros = req.body;
    const url = req.url;
    console.log(`
      Hoy ${new Date()}
      Se ha recibido una consulta en la ruta ${url}
      con los parámetros:
    `, parametros);
    next();
};

module.exports = { reportQuery };
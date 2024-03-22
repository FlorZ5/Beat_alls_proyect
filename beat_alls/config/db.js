const { Sequelize } = require('sequelize');

const db = new Sequelize('beat_alls', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

async function authenticate() {
  try {
    await db.authenticate();
    console.log('Conexión establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}
authenticate();

module.exports = db;
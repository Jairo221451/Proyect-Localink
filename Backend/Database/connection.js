const mysql = require('mysql2/promise');

// Configuración para Railway usando variables de entorno
const connection = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'TochielVroXd12',
  database: process.env.MYSQLDATABASE || 'bd_ds',
  waitForConnections: true,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const [rows] = await connection.execute('SELECT 1');
    console.log('✅ Conexión a MySQL exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
    return false;
  }
};

// Exportar la conexión y la función de prueba
module.exports = {
  connection,
  testConnection
};
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./Database/connection');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Configura esto con tu frontend URL
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Public', 'uploads')));

// Rutas
const authRoutes = require('./Routes/auth.routes');
const emprendimientoRoutes = require('./Routes/emprendimientos.routes');
const comentarioRoutes = require('./Routes/comentarios.routes');
const reporteRoutes = require('./Routes/reportes.routes');
const adminRoutes = require('./Routes/admin.routes');

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Ruta para verificar la conexión a la base de datos
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'OK',
    database: dbStatus ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Aplicar rutas
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/emprendimientos', emprendimientoRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/reportes', reporteRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Probar conexión a la base de datos al iniciar
    console.log('🔄 Probando conexión a la base de datos...');
    await testConnection();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
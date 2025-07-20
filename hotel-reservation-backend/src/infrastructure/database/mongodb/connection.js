const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🐧🟢 MongoDB conectado con éxito');
  } catch (error) {
    console.error('🐧🔴 Error conectando a MongoDB:', error.message);
    process.exit(1); // detiene el server si falla la conexión
  }
};

module.exports = connectDB;
const hotelRoutes = require('./infrastructure/web/routes/hotel.routes');
const roomRoutes = require('./infrastructure/web/routes/room.routes');




const express = require('express');
const cors = require('cors');
require('dotenv').config(); // para usar variables de entorno

const connectDB = require('./infrastructure/database/mongodb/connection');


const app = express();
app.use(express.json()); //middleware para parsear JSON
app.use(cors()); // middleware para permitir cors

connectDB();

app.use('/hotels', hotelRoutes);
app.use('/rooms', roomRoutes);


app.get('/', (req, res) => {
    res.send('API de "El Refugi Fala funcionando🐧" <3');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor de "Fala🐧" escuchando en el puerto ${PORT}`);
});



const { io } = require('../index');

// Mensaje de Sockets

io.on('connection', client => {
  console.log('Cliente conectado');

});
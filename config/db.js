const mongoose = require('mongoose')

//mongoose.connect('mongodb://127.0.0.1/pruebanode') //Usar .env para el link a la bd remota
mongoose.connect(process.env.MONGO_URI)
.then(db => console.log('conexion exitosa'))
.catch(err => console.log('error: ', err))

module.exports = mongoose
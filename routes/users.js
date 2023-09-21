const express = require('express');
const bodyParser = require('body-parser')

const Usuario = require('../models/users.js')

var router = express.Router();

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    res.render('dashboard')
})

router.post('/', (req, res) => {
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let rol = req.body.rol

    let usuario = new Usuario({
        usuario: username,
        email: email,
        password: password,
        rol: rol
    })

    usuario.save()
    .then((data) => {
        res.send("1")
    })
    .catch((err) => {
        res.send("0")
    })

    //res.send('Ruta POST de Usuarios')
})

router.get('/dataUsers', (req, res) => {
    Usuario.find({}, {password: 0})
    .then((data) => {
        console.log(data)
        res.send(data)
    })
    .catch((err) => {
        console.log(err)
    })
})

router.put('/:id', (req, res) => {
    res.send('Ruta POST de Usuarios');
})

router.delete('/:id', (req, res) => {
    res.send('Ruta DELETE de Usuarios');
})

//export this router to use in our index.js
module.exports = router;
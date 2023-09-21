const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
require('dotenv').config()

const Usuario = require('./models/users.js')
const { sessionKey } = require('./config/config.js')
const { users } = require('./routes.js')

const checkSignIn = (req, res, next) => {
    if(req.session.id_user && req.session.username && req.session.email && req.session.rol){
        next()
    } else {
        res.redirect('/login')
    }
}
const checkSignOut = (req, res, next) => {
    if(req.session.id_user && req.session.username && req.session.email && req.session.rol){
        res.redirect('/')
    } else {
        next()
    }
}
const checkRolAdmin = (req, res, next) => {
    if(req.session.id_user && req.session.username && req.session.email && req.session.rol){
        if(req.session.rol == "admin"){
            next()
        }else{
            res.redirect('/restringido')
        }
    } else {
        res.redirect('/login')
    }
}
const app = express()

app.set('view engine', 'pug')
app.set('views','./views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(
    session({
        secret: sessionKey, // Cambia esto a una clave secreta real
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Cambia a 'true' si usas HTTPS
    })
);
app.use(express.static('public'))
app.use('/users', checkRolAdmin, users)

app.get('/', (req, res) => {
    res.redirect("/users")
})

/*
app.get('/aggusers', (req, res) => {
    let usuario = new Usuario({
        usuario: 'admin',
        email: 'admin@gmail.com',
        password: 'hola123',
        rol: 'admin'
    })

    usuario.save()
    .then((data) => {
        console.log(data)
        res.send("Usuario agregado exitosamente")
    })
    .catch((err) => {
        console.log(err)
        res.send("Ocurrio un error: " + err)
    })
})*/

app.get('/login', checkSignOut, (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    let usuario = req.body.username
    let pwd = req.body.password

    Usuario.find({usuario: usuario, password: pwd})
    .then((data) => {
        if(data.length > 0){
            req.session.id_user = data[0]._id
            req.session.username = data[0].email
            req.session.email = data[0].password
            req.session.rol = data[0].rol
            res.status(200).json({text: "Datos ingresados correctamente", status: 200})
        }else{
            res.status(401).json({text: "Datos erroneos", status: 401})
        }
    })
    .catch((err) => {
        console.log(err)
        res.send("0")
    })
})

app.get('/restringido', (req, res, next) => {
    res.send("No tienes acceso a esta pagina")
})

app.get('/logout', checkSignIn, (req, res, next) => {
    req.session.destroy(function(){
        console.log("El usuario cerro su sesion")
    });
    res.redirect('/login');
})


app.listen(process.env.PORT, () => {
    console.log("Pagina corriendo en el puerto " + process.env.PORT)
})
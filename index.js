const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hola Mundo');
}); //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDk1Mjg3ODMsImV4cCI6MTcwOTUyOTA4M30.PWgOsttnD6fiQe4coJEKPDfdBKgokoxOkLtFspMNXIc

app.get('/api', validateToken, (req, res) => {
    res.json({
        username: req.user,
        tuits: [
            {
                id: 0,
                text: 'Este es mi tuit',
                username: 'Huipio'
            },
            {
                id: 0,
                text: 'HTML el mejor',
                usename: 'Mi_primo'
            }
        ]
    })
});

app.get('/login', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <form method="post" action="/auth">
            Nombre de usuario: <input type="text" name="text"><br>
            Contraseña: <input type="password" name="password"><br>
            <input type="submit" value="Iniciar sesión">
        </form>
    </body>
    </html>`);
});

app.post('/auth',(req, res) =>{
    const {username, password} = req.body;

    const user = {username: username};

    const accessToken = generateAccessToken(user);

    res.header('authorization', accessToken).json({
        message: 'Usuario autenticado',
        token: accessToken
    });
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, {expiresIn: '5m'});
}

function validateToken(req, res, next) {
    const accessToken = req.headers['authorization'] || req.query.accessToken;
    if (!accessToken) res.send('Acceso denegado');

    jwt.verify(accessToken, process.env.SECRET, (err, user) => {
        if (err) {
            res.send('Acceso denegado, el token expiro o es incorrecto');
        }else{
            req.user = user;
            next();
        }
    });
}

app.listen(3000, () => {
    console.log('Servidor iniciando...');
});
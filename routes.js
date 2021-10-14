const express = require('express');
const route = express.Router();

//importando controllers
const home = require('./src/controllers/homeController');
const abertura = require('./src/controllers/aberturaController');
const admin = require('./src/controllers/adminController');
const usuario = require('./src/controllers/usuarioController');
const registro = require('./src/controllers/registroController');
const {logado} = require('./src/middlewares/middlewaresGlobais');
/* const esp32 = require('./src/controllers/esp32Controller') */

//Importando middlewares locais

//Rotas login
route.get('/login', admin.getLoginAdmin);
route.post('/login', admin.postLoginAdmin);

//Rotas Home - index.ejs
route.get('/', home.redirectHome);
route.get('/abertura', logado, abertura.getAbertura);
route.get('/usuarios', logado, usuario.getUsuario);
route.get('/usuarios/register', logado, usuario.getCriarUsuario);
route.post('/usuarios/register', logado, usuario.postCriarUsuario);
route.get('/usuarios/edit/:id', logado, usuario.getEditUsuario);
route.post('/usuarios/edit/:id', logado, usuario.postEditUsuario);
route.get('/usuarios/delete/:id', logado, usuario.deleteUsuario);
route.get('/registros', logado, registro.getRegistro);
route.get('/registros/delete/:id', logado, registro.deleteRegistro);
//route.get('/horarios', logado, horario.getHorarios);
//route.get('/visitantes');
//route.post('/visitantes/register');
route.get('/admins', logado, admin.getAdmin);
route.get('/admins/register', logado, admin.getCriarAdmin);
route.post('/admins/register', logado, admin.postCriarAdmin);
route.get('/admins/edit/:id', logado, admin.getEditAdmin);
route.post('/admins/edit/:id', logado, admin.postEditAdmin);
route.get('/admins/delete/:id', logado, admin.deleteAdmin);
route.get('/home/logout', logado, home.homeLogout);


//Rotas cadastro admins
/* route.get('/register', admin.getCriarAdmin);
route.post('/register/register', admin.postCriarAdmin); */

module.exports = route;
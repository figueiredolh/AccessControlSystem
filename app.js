const port = 3000;
const express = require('express');
const app = express();

//Conexão com banco de dados
require('dotenv').config(); //importando .env
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOCONNECTION) //retorna uma promessa
.then(()=>{
  console.log('Conectado à base de dados');
  app.emit('DBConectado'); //emite um alerta assim que a promessa for resolvida
}).catch(e =>{
  console.log(e);
});

//bodyParser express
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Websockets & ESP32
const expressWs = require('express-ws')(app);
let appWs = expressWs.app;
let aWss = expressWs.getWss('/');

appWs.ws('/', function(ws, req) {
  console.log('Servidor websocket conectado');

  ws.onmessage = function(msg) {
    console.log('Mensagem do client: ' + msg.data);
  };
});

let wsBroadcast = (obj)=>{
  aWss.clients.forEach(function (client) {
    client.send(JSON.stringify(obj));
  });
}

const Usuario = require('./src/models/UsuarioModel');
const Registro = require('./src/models/RegistroModel');
app.post('/tag', async function(req, res){
  try{
    if(req.headers['user-agent'] !== 'ESP32HTTPClient' && req.headers['auth-key'] !== '3df456dgfjga5hdk74'){
      return res.status(401).send('Não autorizado');
    }
    let rfidUid = req.query.rfiduid;
    console.log(rfidUid);
    let rfidUser = new Usuario({tag: rfidUid});
    let objBuscarTags = await rfidUser.buscarTags();
    //console.log(objBuscarTags);
    let objRegistro = {
      nome: !!objBuscarTags ? objBuscarTags.nome : 'Sem identificação', 
      tag: rfidUid,
      status: !!objBuscarTags ? 'Autorizado' : 'Não autorizado',
      data: formatarData(new Date())
    }
    //
    if(!objBuscarTags){
      console.log('Usuário não encontrado');
      //adicionar no BD em Registros - Não autorizado
      let registro = new Registro(objRegistro);
      await registro.criarRegistro();
      //const registros = await registro.listarRegistros();
      wsBroadcast(registro.register);
      res.status('401').send('Não autorizado');
      return;
    }
    console.log('Usuário encontrado');
    //adicionar no BD em Registros - Autorizado/OK
    let registro = new Registro(objRegistro);
    await registro.criarRegistro();
    //const registros = await registro.listarRegistros();
    wsBroadcast(registro.register);
    res.status(200).send('OK');
  }
  catch(e){
    console.log(e);
  }
}
);

function formatarData(data){
  let $data = verificarDigito(data.getDate()) + '/' + verificarDigito(data.getMonth()+1) + '/' + verificarDigito(data.getFullYear());
  let $hora = verificarDigito(data.getHours()) + ':' + verificarDigito(data.getMinutes()) + ':' + verificarDigito(data.getSeconds());
  return `${$data} ${$hora}`;
}

function verificarDigito(metodoData){
  return (metodoData < 10 ? '0' + metodoData : metodoData);
}

//ESP 32 - HTTP POST
/* const esp32 = require('./src/controllers/esp32Controller');
app.post('/tag', esp32.postEsp32Client); */

//Setando arquivos estáticos
const path = require('path');
app.use(express.static(path.resolve(__dirname, 'public')));

//express-session & connect-mongo - Criar sessões na DB
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const sessionOptions = session({
  secret: 'akasdfj0t23453456+54qt23qv',
  store: MongoStore.create({ mongoUrl: process.env.MONGOCONNECTION}),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 2, //Cookies salvos no mongoDB por 2 dias
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

//Setando views
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

//Helmet - desabilitado para localhost
  //const helmet = require('helmet');
  //app.use(helmet());

//csrf
const csrf = require('csurf');
app.use(csrf());

//Nossas middlewares
const {middlewareGlobal, csrfErro, csrfToken} = require('./src/middlewares/middlewaresGlobais');
app.use(middlewareGlobal);
app.use(csrfErro);
app.use(csrfToken);

//importando e usando rotas (route.js)
const routes = require('./routes');
const { json } = require('express');
app.use(routes);

//Ouvindo porta após conexão à base de dados
app.on('DBConectado', () => {
  app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
  });
});


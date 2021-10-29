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

//rota websockets para registros
appWs.ws('/', function(ws, req) {
  console.log('Websocket aberto em registro.ejs');

  ws.onmessage = function(msg) {
    console.log('Mensagem de registro.ejs: ' + msg.data);
  };
});

let wsBroadcast = (obj)=>{
  aWss.clients.forEach(function (client) {
    client.send(JSON.stringify(obj));
  });
}

//rota websockets para abertura remota
appWs.ws('/abertura', function(ws, req) {
  console.log('Servidor websocket conectado');
  
  ws.onmessage = function(msg) {
    console.log('Mensagem do client: ' + msg.data);
    if(msg.data === "OK") wsBroadcast_ab("OFF");
  };
});

app.post('/abertura', function(req, res){
  wsBroadcast_ab("ON");
  /* res.redirect('back'); */
  console.log(req.body.abrir);
  res.status(200).send('OK');
});

let wsBroadcast_ab = (str)=>{
  aWss.clients.forEach(function (client) {
    client.send(str);
  });
}

const Usuario = require('./src/models/UsuarioModel');
const Registro = require('./src/models/RegistroModel');
const Horario = require('./src/models/HorarioModel');
const Visitante = require('./src/models/VisitanteModel');

app.post('/tag', async function(req, res){
  try{
    if(req.headers['user-agent'] !== 'ESP32HTTPClient' && req.headers['auth-key'] !== '3df456dgfjga5hdk74'){
      return res.status(401).send('Não autorizado');
    }
    let rfidUid = req.query.rfiduid;
    console.log(rfidUid);

    let rfidUser = new Usuario({tag: rfidUid});
    let rfidUserHorario = new Horario({tag:rfidUid});

    let objBuscarTags = await rfidUser.buscarTags();
    let objBuscarTagsHorario = await rfidUserHorario.buscarTags();

    let objRegistro = {
      nome: !!objBuscarTags ? objBuscarTags.nome : 'Sem identificação', 
      tag: rfidUid,
      status: !!objBuscarTags ? 'Autorizado' : 'Não autorizado',
      data: formatarData(new Date())
    }

    let objRegistro2 = {
      nome: !!objBuscarTagsHorario ? objBuscarTagsHorario.nome : 'Sem identificação', 
      tag: rfidUid,
      status: !!objBuscarTagsHorario && verificarHorario(objBuscarTagsHorario, new Date()) ? 'Autorizado' : 'Não autorizado',
      data: formatarData(new Date())
    }

    if(!objBuscarTags){
      let registro = new Registro(objRegistro2);
      await registro.criarRegistro();
      wsBroadcast(registro.register);
      if(objBuscarTagsHorario && verificarHorario(objBuscarTagsHorario, new Date())){
        res.status('200').send('Autorizado');
        return;
      }
      res.status('401').send('Não autorizado');
      return;
    }
    console.log('Usuário encontrado');
    let registro = new Registro(objRegistro);
    await registro.criarRegistro();
    wsBroadcast(registro.register);
    res.status(200).send('OK');
  }
  catch(e){
    console.log(e);
  }
}
);

//post para visitantes
app.post('/visitantes/register', async function(req, res){
  try {
    if(req.body.apagar === 'Apagar'){
      const visitante = new Visitante();
      let buscaVisitante = await visitante.buscarVisitante();
      await visitante.apagarVisitante(buscaVisitante);
      res.status('200').send(buscaVisitante);
      return;
    }
    let expira = new Date(Date.now() + req.body.min * 60 * 1000 + req.body.sec * 1000);
    let $reqBody = {
      senha: req.body.senha,
      expiraEm: expira
    };
    const visitante = new Visitante($reqBody);
    let buscaVisitante = await visitante.buscarVisitante();
    await visitante.criarVisitante();
    res.status('200').send(buscaVisitante);
  } catch (error) {
    console.log(error)
  }
});

app.get('/visitantes/api', async function(req, res){
  const visitante = new Visitante();
  let buscaVisitante = await visitante.buscarVisitante();
  res.send(buscaVisitante);
});

function formatarData(data){
  let $data = verificarDigito(data.getDate()) + '/' + verificarDigito(data.getMonth()+1) + '/' + verificarDigito(data.getFullYear());
  let $hora = verificarDigito(data.getHours()) + ':' + verificarDigito(data.getMinutes()) + ':' + verificarDigito(data.getSeconds());
  return `${$data} ${$hora}`;
}

function verificarDigito(metodoData){
  return (metodoData < 10 ? '0' + metodoData : metodoData);
}

function verificarHorario(obj, date){
  let $horarioEntrada = obj.horarioEntrada.split(':');
  let $horarioSaida = obj.horarioSaida.split(':');

  let horarioEntrada = new Date(date.getFullYear(), date.getMonth(), date.getDate(), + $horarioEntrada[0], + $horarioEntrada[1]);
  let horarioSaida = new Date(date.getFullYear(), date.getMonth(), date.getDate(), + $horarioSaida[0], + $horarioSaida[1]);

  if(horarioEntrada.getTime() > horarioSaida.getTime()) {
    if(date.getTime() < horarioSaida.getTime()){
      horarioEntrada = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, + $horarioEntrada[0], + $horarioEntrada[1]);
    }
    else{
      horarioSaida = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, + $horarioSaida[0], + $horarioSaida[1]);
    }
  }

  let verificarDiaSemana = (obj.diaEntrada <= date.getDay()) && (date.getDay() <= obj.diaSaida);
  let verificarHora = (horarioEntrada.getTime() <= date.getTime()) && (date.getTime() <= horarioSaida.getTime());

  return verificarDiaSemana && verificarHora;
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


const Usuario = require('../models/UsuarioModel');
const Registro = require('../models/RegistroModel');
/* Autorizar usuario via Esp32 */

exports.postEsp32Client = async (req, res) =>{
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
      res.status('401').send('Não autorizado');
      return;
    }
    console.log('Usuário encontrado');
    //adicionar no BD em Registros - Autorizado/OK
    let registro = new Registro(objRegistro);
    await registro.criarRegistro();
    res.status(200).send('OK');
  }
  catch(e){
    console.log(e);
  }
}

function formatarData(data){
  let $data = verificarDigito(data.getDate()) + '/' + verificarDigito(data.getMonth()+1) + '/' + verificarDigito(data.getFullYear());
  let $hora = verificarDigito(data.getHours()) + ':' + verificarDigito(data.getMinutes()) + ':' + verificarDigito(data.getSeconds());
  return `${$data} ${$hora}`;
}

function verificarDigito(metodoData){
  return (metodoData < 10 ? '0' + metodoData : metodoData);
}
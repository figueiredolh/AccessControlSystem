const mongoose = require('mongoose');

const VisitanteSchema = new mongoose.Schema({
  senha:{
    type: String,
    required: true
  },
  expiraEm: {
    type: Date,
    expires: 0,
    default: Date.now
  },
  criadoEm:{
    type: Date,
    default: Date.now
  }
});

let VisitanteModel = mongoose.model('visitante', VisitanteSchema);

class Visitante{
  constructor(body){
    this.body = body;
    this.visitor = '';
  }

  async criarVisitante(){
    this.visitor = await VisitanteModel.create(this.body);
  }

  async buscarVisitantes(){
    let busca = await VisitanteModel.find();
    return busca;
  }

  async buscarSenhaVisitante(){
    let senha = await VisitanteModel.findOne({senha: this.body.visitante});
    return senha;
  }

  async apagarVisitante(visitante){
    await VisitanteModel.findOneAndDelete(visitante);
  }
}

module.exports = Visitante;
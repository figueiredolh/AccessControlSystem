const mongoose = require('mongoose');

const RegistroSchema = new mongoose.Schema({
  nome:{
    type: String,
    default: ''
  },
  tag:{
    type: String,
    required: true
  },
  status:{
    type: String,
    required: true
  },
  data:{
    type: String,
    default: ''
  },
  criadoEm:{
    type: Date,
    default: Date.now
  }
});

const RegistroModel = mongoose.model('Registro', RegistroSchema);

class Registro{
  constructor(body){
    this.body = body;
    this.register = null;
  }

  async criarRegistro(){
    this.register = await RegistroModel.create(this.body);
  }

  async listarRegistros(){
    const listaRegistros = await RegistroModel.find().sort({criadoEm: -1});
    return listaRegistros;
  }

  async apagarRegistro(id){
    if(typeof id !== 'string') return;
    return await RegistroModel.findByIdAndDelete(id);
  }

  tratarDados(){
    for(let propriedade in this.body){
      if(typeof this.body[propriedade] !== 'string'){
        this.body[propriedade] = '';
      }
    }
  }
}

module.exports = Registro;
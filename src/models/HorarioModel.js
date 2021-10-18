const mongoose = require('mongoose');

const HorarioSchema = new mongoose.Schema({
  nome:{
    type: String,
    default: ''
  },
  tag:{
    type: String,
    required: true
  },
  diaEntrada: {
    type: String,
    required: true
  },
  diaSaida: {
    type: String,
    required: true
  },
  horarioEntrada: {
    type: String,
    required: true
  },
  horarioSaida: {
    type: String,
    required: true
  },
  criadoEm:{
    type: Date,
    default: Date.now
  }
});

const HorarioModel = mongoose.model('Horario', HorarioSchema);

class Horario{
  constructor(body){
    this.body = body;
    this.errors = [];
    this.schedule = '';
  }

  //criar horario
  async criarHorario(){
    this.validar();
    if(this.errors.length > 0) return;
    //
    await this.verificarHorarioCriado();
    if(this.errors.length > 0) return; //verificação de erros de usuário da base de dados

    this.schedule = await HorarioModel.create(this.body); //Registro de usuário na base de dados
  }

  async verificarHorarioCriado(){
    try{
      if(await HorarioModel.findOne({tag: this.body.tag})){
        this.errors.push('Tag já cadastrada');
      }
      if(await mongoose.model('Usuario').findOne({tag: this.body.tag})){
        this.errors.push('Tag já cadastrada em Usuários');
      }
    }
    catch(e){
      console.log(e);
    }
  }

  validar(){
    //Validar strings
    this.tratarDados();
    if(!this.body.nome){
      this.errors.push('Nome não preenchido');
    }
    if(!this.body.tag){
      this.errors.push('Tag não preenchida');
    }
    if(this.body.tag.length > 20){
      this.errors.push('Limite de bytes excedido');
    }
    if(!this.body.diaEntrada){
      this.errors.push('Dia de Entrada não preenchido');
    }
    if(!this.body.diaSaida){
      this.errors.push('Dia de Saída não preenchido');
    }
    if(!this.body.horarioEntrada){
      this.errors.push('Horario de Entrada não preenchido');
    }
    if(!this.body.horarioSaida){
      this.errors.push('Horario de Saída não preenchido');
    }
  }

  tratarDados(){
    //Limpar valores de cada propriedade do this.body (conteúdo do req.body) como token, nome e senha caso forem diferentes de string. Isso evita que o formulário seja enviado com os tipos de dados incorretos
    for(let propriedade in this.body){
      if(typeof this.body[propriedade] !== 'string'){
        this.body[propriedade] = '';
      }
    }
    //Enviar apenas o necessário ao this.body. Alteração do valor de this.body
    this.body = {
      nome: this.body.nome,
      tag: this.body.tag.toUpperCase(),
      diaEntrada: this.body.diaEntrada,
      diaSaida: this.body.diaSaida,
      horarioEntrada: this.body.horarioEntrada,
      horarioSaida: this.body.horarioSaida,
    }
  }

  /* Listar Horários */

  async listarHorarios(){
    const listaContatos = await HorarioModel.find().sort({criadoEm: -1});
    return listaContatos;
  }

  /* Editar Horário */

  //Link Editar - Busca de usuário por ID
  async buscarId(id){
    if(typeof id !== 'string') return;
    const scheduleId = await HorarioModel.findById(id);
    return scheduleId;
  }

  async atualizarHorario(id){
    this.validar();
    if(this.errors.length > 0) return;
    //verificar se nome, email e senha permanecem inalterados
    this.schedule = await HorarioModel.findById(id);
    if(this.schedule.nome === this.body.nome && this.schedule.tag === this.body.tag && this.schedule.diaEntrada === this.body.diaEntrada && this.schedule.diaSaida === this.body.diaSaida && this.schedule.horarioEntrada === this.body.horarioEntrada && this.schedule.horarioSaida === this.body.horarioSaida) return this.errors.push('Dados inalterados');
    this.schedule = await HorarioModel.findOneAndUpdate(id, this.body, {new: true});
  }

  /* Apagar Horario */
  async apagarHorario(id){
    if(typeof id !== 'string') return;
    return await HorarioModel.findByIdAndDelete(id);
  }

  /* Esp32 - Verificação de tags cadastradas */

  async buscarTags(){
    return await HorarioModel.findOne({tag: this.body.tag});
  }
}

module.exports = Horario;
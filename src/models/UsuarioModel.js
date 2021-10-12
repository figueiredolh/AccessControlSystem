const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome:{
    type: String,
    required: true
  },
  tag:{
    type: String,
    required: true
  },
  criadoEm:{
    type: Date,
    default: Date.now
  }
});

const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);

class Usuario{
  constructor(body){
    this.body = body;
    this.errors = [];
    this.user = '';
  }

  //criar usuario
  async criarUsuario(){
      this.validar();
      if(this.errors.length > 0) return;
      //
      await this.verificarUsuarioCriado();
      if(this.errors.length > 0) return; //verificação de erros de usuário da base de dados

      this.user = await UsuarioModel.create(this.body); //Registro de usuário na base de dados
  }

  async verificarUsuarioCriado(){
    try{
      if(await UsuarioModel.findOne({tag: this.body.tag})){
        this.errors.push('Tag já cadastrada');
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
      tag: this.body.tag.toUpperCase()
    }
  }

  /* Listar Usuários */

  async listarUsuarios(){
    const listaContatos = await UsuarioModel.find().sort({criadoEm: -1});
    return listaContatos;
  }

  /* Editar Usuario */

  //Link Editar - Busca de usuário por ID
  async buscarId(id){
    if(typeof id !== 'string') return;
    const userId = await UsuarioModel.findById(id);
    return userId;
  }

  async atualizarUsuario(id){
    this.validar();
    if(this.errors.length > 0) return;
    //verificar se nome, email e senha permanecem inalterados
    this.admin = await UsuarioModel.findById(id);
    if(this.admin.nome === this.body.nome && this.admin.tag === this.body.tag) return this.errors.push('Dados inalterados');
    this.admin = await AdminModel.findOneAndUpdate(id, this.body, {new: true});
  }

  /* Apagar Usuario */
  async apagarUsuario(id){
    if(typeof id !== 'string') return;
    return await UsuarioModel.findByIdAndDelete(id);
  }

  /* Esp32 - Verificação de tags cadastradas */

  async buscarTags(){
    return await UsuarioModel.findOne({tag: this.body.tag});
  }
}

module.exports = Usuario;
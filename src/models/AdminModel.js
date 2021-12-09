const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  nome:{
    type: String,
    default: ''
  },
  email:{
    type: String,
    required: true
  },
  senha:{
    type: String,
    required: true
  },
  criadoEm:{
    type: Date,
    default: Date.now
  }
});

const AdminModel = mongoose.model('Admin', AdminSchema);

class Admin{
  constructor(body){
    this.body = body;
    this.errors = [];
    this.admin = '';
  }

  //criar admin
  async criarAdmin(){
      this.validar();
      if(this.errors.length > 0) return; //verificação de erros dos campos email e senha ("dados puros")
      //criar hash em senha
      this.criarHash();
      //
      await this.verificarAdminCriado();
      if(this.errors.length > 0) return; //verificação de erros de usuário da base de dados

      this.admin = await AdminModel.create(this.body); //Registro de usuário na base de dados
  }

  async verificarAdminCriado(){
    try{
      if(await AdminModel.findOne({email: this.body.email})){
        this.errors.push('Usuário já existe');
      }
    }
    catch(e){
      console.log(e);
    }
  }

  criarHash(){
    const salt = bcrypt.genSaltSync();
    this.body.senha = bcrypt.hashSync(this.body.senha, salt);
  }

  validar(){
    //Validar strings
    this.tratarDados();
    //Validar se é e-mail verdadeiro
    if(!validator.isEmail(this.body.email)){
      this.errors.push('E-mail inválido');
    }
    //Validar tamanho da senha. Entre 5 e 20 caracteres.
    if(this.body.senha.length < 5 || this.body.senha.length > 20){
      this.errors.push('Senha precisa ter entre 5 e 20 caracteres');
    };
  }

  tratarDados(){
    //Limpar valores de cada propriedade do this.body (conteúdo do req.body) como token, email e senha caso forem diferentes de string. Isso evita que o formulário seja enviado com os tipos de dados incorretos
    for(let propriedade in this.body){
      if(typeof this.body[propriedade] !== 'string'){
        this.body[propriedade] = '';
      }
    }
    //Enviar apenas o necessário ao this.body. Alteração do valor de this.body
    this.body = {
      nome: this.body.nome,
      email: this.body.email,
      senha: this.body.senha
    }
  }

  //logar admin - verificação

  async logarAdmin(){
    //verificar se o usuário digitado no campo de usuário bate com o usuário da base de dados
    //se não existir, mandar msg de erro
    this.admin = await AdminModel.findOne({email: this.body.email});
    if(!this.admin){
      this.errors.push('Usuário não encontrado');
      return;
    }
    //se batem, verificar se a senha digitada no campo bate com a senha relacionada ao hash da base
    //se não existir, mandar msg de erro
    if(!bcrypt.compareSync(this.body.senha, this.admin.senha)){
      this.errors.push('Senha incorreta');
      this.admin = null;
      return;
    }
  }

  /* Listar Admins */

  async listarAdmins(){
    const admins = await AdminModel.find().sort({criadoEm: -1});
    return admins;
  }

  /* Editar Admin */

  //Link Editar - Busca de usuário por ID
  async buscarId(id){
    if(typeof id !== 'string') return;
    const adminid = await AdminModel.findById(id);
    return adminid;
  }

  async atualizarAdmin(id){
    this.validar();
    if(this.errors.length > 0) return;
    //verificar se nome, email e senha permanecem inalterados
    this.admin = await AdminModel.findById(id);
    if(this.admin.nome === this.body.nome && this.admin.email === this.body.email && bcrypt.compareSync(this.body.senha, this.admin.senha)) return this.errors.push('Dados inalterados');

    this.criarHash();
    this.admin = await AdminModel.findOneAndUpdate({_id: id}, this.body, {new: true});
  }

  /* Apagar Admin */
  async apagarAdmin(id){
    if(typeof id !== 'string') return;
    const admins = await AdminModel.find();
    if(admins.length <=1) return this.errors.push('Sistema precisa ter ao menos 1 administrador');
    return await AdminModel.findByIdAndDelete(id);
  }
}

module.exports = Admin;


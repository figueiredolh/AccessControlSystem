const Usuario = require('../models/UsuarioModel');

exports.getUsuario = async (req, res) => {
  try {
    const usuario = new Usuario();
    const usuarios = await usuario.listarUsuarios();
    res.render('usuarios', {usuarios});
  } catch (e) {
    console.log(e);
  }
}

exports.getCriarUsuario = (req, res)=>{
  res.render('usuariosRegister');
}

exports.postCriarUsuario = async (req, res) => {
  try{
    const register = new Usuario(req.body);
    await register.criarUsuario();
    if(register.errors.length > 0){
      req.flash('errors', register.errors);
      //redirecionar para a mesma página
      req.session.save(()=>{
        return res.redirect('back');
      })
      return;
    }
    req.flash('success', 'Usuário criado com sucesso');
    req.session.save(function(){
      return res.redirect('back');
    });
  } catch(e){
    console.log(e);
  }
}

/* Editar usuário */

exports.getEditUsuario = async (req, res)=>{
  try {
    const id = req.params.id;
    if(!id) return res.send('404');
    const edit = new Usuario();
    const usuario = await edit.buscarId(id);
    res.render('usuarioEdit', {usuario});
  } catch (e) {
    console.log(e);
  }
}

exports.postEditUsuario = async (req, res)=>{
  try{
    const id = req.params.id;
    if(!id) return res.send('404');
    const update = new Usuario(req.body);
    await update.atualizarUsuario(id);
    if(update.errors.length > 0){
      req.flash('errors', update.errors);
      //Salvar a sessão e redirecionar para a mesma página
      req.session.save(()=>{
        return res.redirect('back');
      })
      return;
    }
    req.flash('success', 'Usuário atualizado com sucesso');
    req.session.save(function(){
      return res.redirect('back');
    });
  } catch(e){
    console.log(e);
  }
}

/* Apagar Usuário */

exports.deleteUsuario = async (req, res)=>{
  try {
    const id = req.params.id;
    if(!id) return console.log('404');
    const $delete = new Usuario();
    await $delete.apagarUsuario(id);
    req.flash('success', 'Usuário apagado com sucesso');
    req.session.save(() => res.redirect('back'));
  } catch (e) {
    console.log(e);
  }
}
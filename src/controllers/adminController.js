const Admin = require('../models/AdminModel');

//Lista de admins
exports.getAdmin = async (req, res)=>{
  try {
    const admin = new Admin();
    const admins = await admin.listarAdmins();
    res.render('admins', {admins});
  } catch (e) {
    console.log(e);
  }
}

//Criar admin - get e post
exports.getCriarAdmin = (req, res) => {
  res.render('adminsRegister');
}

exports.postCriarAdmin = async (req, res) => {
  try{
    const register = new Admin(req.body);
    await register.criarAdmin();
    if(register.errors.length > 0){
      req.flash('errors', register.errors);
      //Salvar a sessão e redirecionar para a mesma página
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

/* --------------Login Admin------------------ */

exports.getLoginAdmin = (req, res)=>{
  //console.log(!!req.session.admin);
  res.render('login');
}

exports.postLoginAdmin = async (req, res)=>{
  try{
    const login = new Admin(req.body);
    await login.logarAdmin();

    if(login.errors.length > 0){
      req.flash('errors', login.errors);
      req.session.save(function(){
        return res.redirect('back');
      });
      return;
    }
    //Salvar sessão e redirecionar para a plataforma
    //req.flash('success', 'Logado com sucesso');
    req.session.admin = login.admin;
    req.session.save(function(){
      return res.redirect('/');
    });
  } catch(e){
    console.log(e);
  }
}

/* Editar admin */

exports.getEditAdmin = async (req, res)=>{
  try {
    const id = req.params.id;
    if(!id) return res.send('404');
    const edit = new Admin();
    const admin = await edit.buscarId(id);
    res.render('adminEdit', {admin});
  } catch (e) {
    console.log(e);
  }
}

exports.postEditAdmin = async (req, res)=>{
  try{
    const id = req.params.id;
    if(!id) return res.send('404');
    const admin = new Admin(req.body);
    await admin.atualizarAdmin(id);
    if(admin.errors.length > 0){
      req.flash('errors', admin.errors);
      //Salvar a sessão e redirecionar para a mesma página
      req.session.save(()=>{
        return res.redirect('back');
      })
      return;
    }
    req.flash('success', 'Admin atualizado com sucesso');
    req.session.save(function(){
      return res.redirect('back');
    });
  } catch(e){
    console.log(e);
  }
}

/* Apagar Usuário */

exports.deleteAdmin = async (req, res)=>{
  try {
    const id = req.params.id;
    if(!id) return console.log('404');
    const admin = new Admin();
    await admin.apagarAdmin(id);
    if(admin.errors.length > 0){
      req.flash('errors', admin.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
    req.flash('success', 'Admin apagado com sucesso');
    req.session.save(() => res.redirect('back'));
  } catch (e) {
    console.log(e);
  }
}
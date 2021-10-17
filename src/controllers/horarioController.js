const Horario = require('../models/HorarioModel');

exports.getHorario = async (req, res)=>{
  try{
    const horario = new Horario();
    const horarios = await horario.listarHorarios();
    res.render('horarios', {horarios});
  }catch(e){
    console.log(e);
  }
}

/* Criar Horário */

exports.getCriarHorario = (req, res)=>{
  res.render('horariosRegister');
}

exports.postCriarHorario = async (req, res) => {
  try{
    const register = new Horario(req.body);
    await register.criarHorario();
    if(register.errors.length > 0){
      req.flash('errors', register.errors);
      //redirecionar para a mesma página
      req.session.save(()=>{
        return res.redirect('back');
      })
      return;
    }
    req.flash('success', 'Usuário agendado com sucesso');
    req.session.save(function(){
      return res.redirect('back');
    });
  } catch(e){
    console.log(e);
  }
}

/* Editar Horário */

exports.getEditHorario = async (req, res)=>{
  try {
    const id = req.params.id;
    if(!id) return res.send('404');
    const edit = new Horario();
    const horario = await edit.buscarId(id);
    res.render('horarioEdit', {horario});
  } catch (e) {
    console.log(e);
  }
}

exports.postEditHorario = async (req, res)=>{
  try{
    const id = req.params.id;
    if(!id) return res.send('404');
    const update = new Horario(req.body);
    await update.atualizarHorario(id);
    if(update.errors.length > 0){
      req.flash('errors', update.errors);
      //Salvar a sessão e redirecionar para a mesma página
      req.session.save(()=>{
        return res.redirect('back');
      })
      return;
    }
    req.flash('success', 'Horário atualizado com sucesso');
    req.session.save(function(){
      return res.redirect('back');
    });
  } catch(e){
    console.log(e);
  }
}

/* Apagar Horário */

exports.deleteHorario = async (req, res)=>{
  try {
    const id = req.params.id;
    if(!id) return console.log('404');
    const $delete = new Horario();
    await $delete.apagarHorario(id);
    req.flash('success', 'Horário apagado com sucesso');
    req.session.save(() => res.redirect('back'));
  } catch (e) {
    console.log(e);
  }
}
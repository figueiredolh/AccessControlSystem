const Registro = require('../models/RegistroModel');

exports.getRegistro = async (req, res)=>{
  try{
    const registro = new Registro();
    const registros = await registro.listarRegistros();
    res.render('registros', {registros});
  }catch(e){
    console.log(e);
  }
}

exports.deleteRegistro = async (req, res) => {
  try {
    const id = req.params.id;
    if(!id) return console.log('404');
    const registro = new Registro();
    await registro.apagarRegistro(id);
    req.flash('success', 'Registro apagado com sucesso');
    req.session.save(()=> res.redirect('back'));
  } catch(e) {
    console.log(e);
  }
}
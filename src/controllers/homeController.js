/* exports.getHome = (req, res) => {
  if(!!req.session.admin) return res.render('usuarios');
  res.redirect('/login');
} */
exports.homeLogout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
}

exports.redirectHome = (req,res) =>{
  res.redirect('/abertura');
}
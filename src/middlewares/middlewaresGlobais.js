exports.middlewareGlobal = (req, res, next)=>{
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  next();
}
//middleares csrfToken
exports.csrfErro = (err, req, res, next)=>{
  if(err){
    return res.status(404).send('Erro 404');
  }
  next();
}

exports.csrfToken = (req, res, next)=>{
  res.locals.csrfToken = req.csrfToken();
  next();
}

exports.logado = (req, res, next)=>{
    if(!req.session.admin){
      req.session.save(()=>{
        return res.redirect('/login');
      });
      return;
    };
    next();
}
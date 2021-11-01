/* form-Login */

const divConteudo = document.querySelector('.conteudo');
const formLogin = divConteudo.querySelector('.form-login');
const loginUsuario = formLogin.querySelector('#usuario');
const loginSenha = formLogin.querySelector('#senha');
const divAlert  = document.querySelector('#alert-div');

formLogin.addEventListener('submit', function(event){
  if(!loginUsuario.value || !loginSenha.value){
    event.preventDefault();
    criarAviso('Campo e-mail e/ou usuário vazios');
  }
});

/* form-Visitante */

const formVisitante = divConteudo.querySelector('.form-visitante');
const senhaVisitante = formVisitante.querySelector('#senha-visitante');

formVisitante.addEventListener('submit', function(event){
  if(!senhaVisitante.value){
    event.preventDefault();
    criarAviso('Campo não preenchido');
  }
});

function criarAviso(aviso){
  verificarAlert();
  /* const $div = document.createElement('div'); */
  const $text = document.createTextNode(aviso);
  divAlert.appendChild($text);
  divAlert.classList.add('alert');
  divAlert.classList.add('alert-danger');
  /* divConteudo.appendChild(divAlert); */
}

function verificarAlert(){
  if(divConteudo.querySelector('.alert')){
    divAlert.textContent = '';
  }
}

/* Senha de Visitante */

const fieldsetDivs = document.querySelectorAll('.div-fieldset-div');
const activeVisitante = document.querySelector('#visitante');
const btnVoltar = document.querySelector('#voltar');

activeVisitante.addEventListener('click', function(){
  active();
  this.style.visibility = 'hidden';
  verificarAlert();
});

btnVoltar.addEventListener('click', function(){
  active();
  activeVisitante.style.visibility = 'visible';
  verificarAlert();
});

function active(){
  fieldsetDivs.forEach(div =>{
    if(div.className === 'div-fieldset-div active'){
      div.classList.remove('active');
    }
    else
    div.classList.add('active');
  });
}
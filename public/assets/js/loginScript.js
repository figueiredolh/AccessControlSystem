/* Cancelar envio do formulário caso haja algum campo do formulário vazio */
const divConteudo = document.querySelector('.conteudo');
const formLogin = divConteudo.querySelector('form');
const loginUsuario = formLogin.querySelector('#usuario');
const loginSenha = formLogin.querySelector('#senha');
const divAlert  = divConteudo.querySelector('#alert-div');

formLogin.addEventListener('submit', function(event){
  if(!loginUsuario.value || !loginSenha.value){
    event.preventDefault();
    criarAviso();
  }
});

function criarAviso(){
  verificarAlert();
  /* const $div = document.createElement('div'); */
  const $text = document.createTextNode('Campo e-mail e/ou usuário vazios');
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
const btnVisitante = document.querySelector('#visitante');
const btnVoltar = document.querySelector('#voltar');

btnVisitante.addEventListener('click', function(){
  active();
  this.style.visibility = 'hidden';
  verificarAlert();
});

btnVoltar.addEventListener('click', function(){
  active();
  btnVisitante.style.visibility = 'visible';
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
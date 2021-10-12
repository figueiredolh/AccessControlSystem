/* Cancelar envio do formulário caso haja algum campo do formulário vazio */
const fieldset = document.querySelector('.div-fieldset fieldset');
const formLogin = fieldset.querySelector('form');
const loginUsuario = formLogin.querySelector('#usuario');
const loginSenha = formLogin.querySelector('#senha');

formLogin.addEventListener('submit', function(event){
  if(!loginUsuario.value || !loginSenha.value){
    event.preventDefault();
    criarAviso();
  }
})

function criarAviso(){
  const $div = document.createElement('div');
  const $text = document.createTextNode('Campo e-mail e/ou usuário vazios');
  $div.appendChild($text);
  $div.classList.add('alert');
  $div.classList.add('alert-danger');
  fieldset.appendChild($div);
}
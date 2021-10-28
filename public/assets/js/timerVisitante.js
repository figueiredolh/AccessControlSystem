const min = document.querySelector('#min');
const sec = document.querySelector('#sec');

for(let i = 0; i <=30; i++){
  let $div = document.createElement('div');
  let _i = i < 10 ? '0' + i : i;
  let text = document.createTextNode(`${_i}`);
  $div.appendChild(text);
  min.appendChild($div);
}

for(let i = 0; i <=59; i++){
  let $div = document.createElement('div');
  let _i = i < 10 ? '0' + i : i;
  let text = document.createTextNode(`${_i}`);
  $div.appendChild(text);
  sec.appendChild($div);
}

/* slider-min */

const sliderMin = document.querySelector('.slider-min');
let minMin = 0;
const minArray = min.querySelectorAll('div');
let minAtual = 0;
let minIndiceAtual = 0;
const minBtnUp = sliderMin.querySelector('.slider-min--up');
const minBtnDown = sliderMin.querySelector('.slider-min--down');
const minInput = document.querySelector('#minutos');
minArray[0].classList.add('active');

minBtnUp.addEventListener('click', function(){
  minIndiceAtual -= 1;
  if(minIndiceAtual < 0){
    minIndiceAtual = 0;
    return;
  }
  minAtual += 48;
  min.style.transform = `translate3d(0px, ${minAtual}px, 0px)`

  minArray.forEach(div=>{
    let active = div.classList.contains('active');
    if(active){
      div.classList.remove('active');
    }
  });
  minArray[minIndiceAtual].classList.add('active');
  minInput.value = minIndiceAtual;
});

minBtnDown.addEventListener('click', function(){
  minIndiceAtual += 1;
  if(minIndiceAtual > 30){
    minIndiceAtual = 30;
    return;
  }
  minAtual -= 48;
  min.style.transform = `translate3d(0px, ${minAtual}px, 0px)`;

  minArray.forEach(div=>{
    let active = div.classList.contains('active');
    if(active){
      div.classList.remove('active');
    }
  });
  minArray[minIndiceAtual].classList.add('active');
  minInput.value = minIndiceAtual;
});

/* slider-sec */
const sliderSec = document.querySelector('.slider-sec');
let secMin = 0;
const secArray = sec.querySelectorAll('div');
let secAtual = 0;
let secIndiceAtual = 0;
const secBtnUp = sliderSec.querySelector('.slider-sec--up');
const secBtnDown = sliderSec.querySelector('.slider-sec--down');
const secInput = document.querySelector('#segundos');
secArray[0].classList.add('active');

secBtnUp.addEventListener('click', function(){
  secIndiceAtual -= 1;
  if(secIndiceAtual < 0){
    secIndiceAtual = 0;
    return;
  }
  secAtual += 48;
  sec.style.transform = `translate3d(0px, ${secAtual}px, 0px)`

  secArray.forEach(div=>{
    let active = div.classList.contains('active');
    if(active){
      div.classList.remove('active');
    }
  });
  secArray[secIndiceAtual].classList.add('active');
  secInput.value = secIndiceAtual;
});

secBtnDown.addEventListener('click', function(){
  secIndiceAtual += 1;
  if(secIndiceAtual > 59){
    secIndiceAtual = 59;
    return;
  }
  secAtual -= 48;
  sec.style.transform = `translate3d(0px, ${secAtual}px, 0px)`;

  secArray.forEach(div=>{
    let active = div.classList.contains('active');
    if(active){
      div.classList.remove('active');
    }
  });
  secArray[secIndiceAtual].classList.add('active');
  secInput.value = secIndiceAtual;
});

/* senha */
const formVisitante = document.querySelector('.form-visitante');
const senhaInput = document.querySelector('#senha');
const statusSenha = document.querySelector('.status--senha');
const statusTempo = document.querySelector('.status--tempo');

const slider = document.querySelector('.slider');
const $status = document.querySelector('.status');

fetch('/visitantes/api')
.then(response => response.json())
.then($json => {
  console.log($json);
  let objSenha = $json[0];
  if(!objSenha) return;
  statusSenha.textContent = objSenha.senha;
  statusTempo.textContent = `${new Date(objSenha.expiraEm).getTime() - Date.now()}`;
});

formVisitante.addEventListener('submit', function(e){
  gerarSenha();
  mostrarTempo();
  let data = new URLSearchParams();
  data.append('min', minInput.value);
  data.append('sec', secInput.value);
  data.append('senha', senhaInput.value);

  fetch('/visitantes/register', {
    method: 'POST',
    body: data
  })
  .then(response => response.json())
  .then($json => console.log($json));

  e.preventDefault();
});

function gerarSenha() {
  let caracteres = "0123456789abcdefghijklmnopqrstuvwxyz!#*";
  let senhaLength = 6;
  let senha = "";

  for (let i = 0; i < senhaLength; i++) {
    let randomNumber = Math.floor(Math.random() * caracteres.length);
    senha += caracteres.substring(randomNumber, randomNumber + 1);
  }
  statusSenha.textContent = senha;
  senhaInput.value = senha;
}

function mostrarTempo(){
  let tempo = new Date(minInput.value * 60 * 1000 + secInput.value * 1000).getTime();
  statusTempo.textContent = tempo;
}
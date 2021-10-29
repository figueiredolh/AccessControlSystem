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

arrowVisibilityMin();
arrowVisibilitySec();

minBtnUp.addEventListener('click', function(){
  minIndiceAtual -= 1;
  if(minIndiceAtual < 0){
    minIndiceAtual = 0;
    return;
  }
  arrowVisibilityMin();
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
  arrowVisibilityMin();
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

secBtnUp.addEventListener('click', function(){
  secIndiceAtual -= 1;
  if(secIndiceAtual < 0){
    secIndiceAtual = 0;
    return;
  }
  arrowVisibilitySec();  
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
  arrowVisibilitySec();
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

function arrowVisibilityMin(){
  if(minIndiceAtual > 0 && minIndiceAtual < 30){
    minBtnUp.style.visibility = 'visible';
    minBtnDown.style.visibility = 'visible';
  }
  else if(minIndiceAtual === 0){
    minBtnUp.style.visibility = 'hidden';
  }
  else{
    minBtnDown.style.visibility = 'hidden';
  }
}

function arrowVisibilitySec(){
  if(secIndiceAtual > 0 && secIndiceAtual < 59){
    secBtnUp.style.visibility = 'visible';
    secBtnDown.style.visibility = 'visible';
  }
  else if(secIndiceAtual === 0){
    secBtnUp.style.visibility = 'hidden';
  }
  else{
    secBtnDown.style.visibility = 'hidden';
  }
}

/* senha */
const formVisitante = document.querySelector('.form-visitante');
const senhaInput = document.querySelector('#senha');
const statusSenha = document.querySelector('.status--senha');
const statusTempo = document.querySelector('.status--tempo');

const slider = document.querySelector('.slider');
const $status = document.querySelector('.status');
const btn = document.querySelector('.div-btnAbertura--btn');
const small = document.querySelector('.visitante--small');
const timeText = document.querySelector('.time-text');

let apagar = false;
let ms;
let intervalo;

fetch('/visitantes/api')
.then(response => response.json())
.then($json => {
  console.log($json);
  let objSenha = $json[0];
  if(!objSenha) {
    showSlider();
    return;
  };
  showStatus();
  apagar = !apagar;
  btn.textContent = 'Apagar';
  small.textContent = 'Senha atual';
  statusSenha.textContent = objSenha.senha;
  ms = `${new Date(objSenha.expiraEm).getTime() - Date.now()}`;
  statusTempo.textContent = tratarMs();
  iniciarCronometro();
});

formVisitante.addEventListener('submit', function(e){
  if(apagar){
    limparCronometro();
    let data = new URLSearchParams();
    data.append('apagar', 'Apagar');

    fetch('/visitantes/register', {
      method: 'POST',
      body: data
    })
    .then(response => response.json())
    .then($json => console.log($json));
    showSlider();
    btn.textContent = 'Gerar';
    small.textContent = 'Selecione um intervalo de tempo e clique em Gerar';
    apagar = !apagar;
  }
  else{
    gerarSenha();
    mostrarTempo();
    iniciarCronometro();
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
    showStatus();
    btn.textContent = 'Apagar';
    small.textContent = 'Senha atual';
    apagar = !apagar;
  }
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

function showSlider(){
  $visibility('visible', 'hidden');
  $opacity('1', '0');
}

function showStatus(){
  $visibility('hidden', 'visible');
  $opacity('0', '1');
}

function $visibility(_slider, _status){
  slider.style.visibility = _slider;
  timeText.style.visibility = _slider;
  $status.style.visibility = _status;
}

function $opacity(_slider, _status){
  slider.style.opacity = _slider;
  timeText.style.opacity = _slider;
  $status.style.opacity = _status;
}

/* Tempo */

function mostrarTempo(){
  let tempo = new Date(minInput.value * 60 * 1000 + secInput.value * 1000).getTime();
  ms = tempo;
  statusTempo.textContent = tratarMs();
}

function iniciarCronometro(){
  intervalo = setInterval(function(){
    ms -= 1000;
    statusTempo.textContent = tratarMs();
    if(ms <= 0){
      limparCronometro();
    }
  }, 1000);
}

function limparCronometro(){
  clearInterval(intervalo);
}

function tratarMs(){
  const S = 1000;
  const M = 60 * 1000;

  if(ms < S){
    let min = adicionarDigito(0);
    let sec = adicionarDigito(0);
    return `${min} : ${sec}`
  }
  else{
    let min = adicionarDigito(parseInt(ms / M));
    let sec = adicionarDigito(parseInt((ms - min * M)/S));
    return `${min} : ${sec}`
  }
}

function adicionarDigito(num){
  let n = num < 10 ? '0' + num : num;
  return n;
}
const headerBtn = document.querySelector('.header-btn');
const menubarDiv = document.querySelector('.menu-bar');
const menubarBtnClose = document.querySelector('.menu-bar-btn');
const body = document.querySelector('body');
const backBody = document.querySelector('.back-body');

//Animação menu - mobile
headerBtn.addEventListener('click', ativar);
menubarBtnClose.addEventListener('click', desativar);
menubarDiv.addEventListener('click', function(e){
  e.stopPropagation();
});
document.addEventListener('click', desativar);

//Remover eventListener e elemento do dom
window.addEventListener('load', janela);
window.addEventListener('resize', janela);

function ativar(e){
  menubarDiv.classList.add('active');
  body.classList.add('no-scroll');
  backBody.classList.add('background');
  this.style.visibility = 'hidden';
  e.stopPropagation();
}

function desativar(e){
  menubarDiv.classList.remove('active');
  body.classList.remove('no-scroll');
  backBody.classList.remove('background');
  headerBtn.style.visibility = 'visible';
  e.stopPropagation();
}

function janela(){
  if(window.innerWidth >= 768){
    headerBtn.removeEventListener('click', ativar);
    headerBtn.style.display = 'none';
    menubarDiv.style.display = 'none';
  }
  if(window.innerWidth < 768){
    headerBtn.addEventListener('click', ativar);
    headerBtn.style.display = 'block';
    menubarDiv.style.display = 'block';
  }
}
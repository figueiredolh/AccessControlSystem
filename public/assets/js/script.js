const headerBtn = document.querySelector('.header-btn');
const menubarDiv = document.querySelector('.menu-bar');
const menubarBtnClose = document.querySelector('.menu-bar-btn');

//Animação menu - mobile
headerBtn.addEventListener('click', ativar);
menubarBtnClose.addEventListener('click', desativar);

//Remover eventListener e elemento do dom
window.addEventListener('load', janela);
window.addEventListener('resize', janela);

function ativar(){
  menubarDiv.classList.add('active');
  this.style.visibility = 'hidden';
}

function desativar(){
  menubarDiv.classList.remove('active');
  headerBtn.style.visibility = 'visible';
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
const $checkbox = document.querySelector('#checkEveryday');
const selectDiaEntrada = document.querySelector('#diaEntrada');
const selectDiaSaida = document.querySelector('#diaSaida');

$checkbox.addEventListener('change', function(){
  if(this.checked){
    selectDiaEntrada.selectedIndex = 1;
    selectDiaSaida.selectedIndex = 7;
  }
  else{
    if(diaEntradaIndex === 1 && diaSaidaIndex === 7){
      diaEntradaIndex = 0;
      diaSaidaIndex = 0;

      selectDiaEntrada.selectedIndex = diaEntradaIndex;
      selectDiaSaida.selectedIndex = diaSaidaIndex;
    }
    selectDiaEntrada.selectedIndex = 0;
    selectDiaSaida.selectedIndex = 0;
  }
});

let diaEntradaIndex = 0;
let diaSaidaIndex = 0;

selectDiaEntrada.addEventListener('change', function(){
  diaEntradaIndex = this.selectedIndex;
  if(diaEntradaIndex === 1 && diaSaidaIndex === 7) $checkbox.checked = true;
  else $checkbox.checked = false;
});

selectDiaSaida.addEventListener('change', function(){
  diaSaidaIndex = this.selectedIndex;
  if(diaEntradaIndex === 1 && diaSaidaIndex === 7) $checkbox.checked = true;
  else $checkbox.checked = false;
});
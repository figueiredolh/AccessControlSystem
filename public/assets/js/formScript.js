function formValidar(objectConfig){
  this.form = document.querySelector(objectConfig.form);
  this.inputs = {};
  for(let input in objectConfig.inputs){
    let propertyValueInput = objectConfig.inputs[input];
    if(typeof propertyValueInput !== 'string' || !propertyValueInput){
      continue;
    };
    this.inputs[input] = document.querySelector(propertyValueInput);
  }

  let _this = this;
  
  this.form.addEventListener('submit', function(event){
    for(let input in _this.inputs){
      if(!_this.inputs[input].value){
        event.preventDefault();
        criarAviso();
        return;
      }
    }
  });

  function criarAviso(){
    const $section = document.querySelector('.section')
    if($section.querySelector('.alert')){
      let $divAlert = $section.querySelector('.alert');
      $section.removeChild($divAlert);
    }
    const $div = document.createElement('div');
    const $text = document.createTextNode('Campo(s) vazio(s)');
    $div.appendChild($text);
    $div.classList.add('alert');
    $div.classList.add('alert-danger');
    $section.appendChild($div);
  }
}
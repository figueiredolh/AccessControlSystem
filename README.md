<h1>Sistema de Controle de Acesso para Residências</h1>
<p>Projeto de Automação/IoT de controle de acesso voltado à ambientes residenciais. Sistema construído com HTML (EJS), CSS, Node.JS, Express, MongoDB e C++.</p>

<h2>Resumo</h2>
<p>A constante evolução da tecnologia impactou radicalmente o estilo de vida da sociedade 
atual, trazendo aspectos como a velocidade, o estímulo à criatividade e o conforto. Neste
contexto está o advento da Domótica - aliado ao conceito de IoT, em que dispositivos são
integrados para a satisfação das necessidades básicas de segurança, comunicação, gestão
energética e conforto de uma habitação.</p>
<p>O projeto em questão visa desenvolver um sistema 
de controle de acesso RFID para ambientes residenciais utilizando
componentes de baixo custo, em que se utiliza uma interface web para gerenciamento. Além disso, o projeto conta com o desenvolvimento do hardware embarcado,
que se encontra neste repositório: <a href="#">Repositório Hardware/ESP32</a>.</p>

<h2>Funcionamento Básico do Sistema</h2>
<p>O projeto tem como objetivo fazer a integração de
um hardware a um software, ou seja, realizar a integração entre um sistema de controle de
acesso via RFID à uma plataforma web de gerenciamento. Para atingir esse objetivo, o modelo
adotado está baseado na presença de um servidor central para o atendimento das requisições
HTTP feitas pelos clientes. </p>
<p> Os clientes - neste modelo - são o microcontrolador ESP 32,
conectado diretamente a um leitor RFID e à própria fechadura eletrônica, e a plataforma web,
acessada via dispositivo Desktop ou Mobile. A integração dos componentes pode ser vista na figura abaixo:</p>

<div width="900px" height="499px"><img src="https://user-images.githubusercontent.com/74880337/148081800-74e6ca6c-7df4-402f-b801-e70ef7234631.jpg"></div>

<p><b>O funcionamento primordial do sistema ocorre da seguinte maneira:</b></p>
<p>1. O ESP 32, após a leitura de um cartão RFID, envia uma requisição HTTP com seus
dados ao servidor.</p>
<p>2. O servidor por sua vez realiza uma busca na base de dados a fim de verificar se o
presente cartão está cadastrado.</p>
<p>3. Por fim, dependendo do resultado da consulta à base de dados, o servidor envia uma
resposta ao microcontrolador para realizar ou não a liberação do acesso do usuário</p>

<h2>Funcionalidades da Plataforma</h2>

<p>A partir de um dispositivo web/mobile, através de um administrador, se realiza o
cadastro e consultas dos usuários através de uma interface amigável e intuitiva, sendo o sistema
de controle propriamente dito. O sistema em questão possui as seguintes funcionalidades:</p>

<ul>
<li><b>Usuários RFID:</b> Permite a consulta, a adição, a edição e a exclusão de usuários com
acesso rfid;</li>
<li><b>Administradores:</b> Permite a consulta, a adição, a edição e a exclusão de
administradores do sistema. Obs.: O sistema precisa ter ao menos um administrador
cadastrado, sendo negada a sua exclusão neste caso;</li>
<li><b>Registros:</b> Permite a consulta e a exclusão dos registros dos usuários, baseados no dia
e horário de acesso.</li>
<li><b>Horários de Acesso:</b> Permite a consulta, a adição, a edição e a exclusão de usuários rfid
com limitação de horários e dias de acesso. Obs.: Um usuário rfid já cadastrado em
Usuários RFID tem seu cadastro negado e vice-versa.</li>
<li><b>Senha de Visitante:</b> Permite excluir e gerar senhas de 6 caracteres - letras e números -
para o acesso de visitantes, com o tempo limite de 30 minutos. Após esse período, será
feita automaticamente sua exclusão.</li>
</ul>



//var mensagem = "variavel global";

// criando as variaveis
var trex ,trex_correndo, trex_colidiu, somPulo, somMorte, somCheckpoint;

var bordas;

var solo, imagemsolo, soloinvisivel;

var imagemNuvem, nuvem, grupodeNuvens;

var imagemObstacolo1, imagemObstacolo2, imagemObstacolo3, imagemObstacolo4, imagemObstacolo5, imagemObstacolo6, obstacolo, grupodeObstacolos;

var rand; 

var placar = 0;

var JOGAR = 1;
var ENCERRAR = 0;
var estadodojogo = JOGAR;

var imagem_gameOver, imagem_restart, gameOver, restart;


// carrega uma imagem para as variaveis
function preload(){
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");

  imagemsolo = loadImage("ground2.png");
  
  imagemNuvem = loadImage("cloud.png");
  
  imagemObstacolo1 = loadImage("obstacle1.png");
  
  imagemObstacolo2 = loadImage("obstacle2.png");
  
  imagemObstacolo3 = loadImage("obstacle3.png");
  
  imagemObstacolo4 = loadImage("obstacle4.png");

  imagemObstacolo5 = loadImage("obstacle5.png");
  
  imagemObstacolo6 = loadImage("obstacle6.png");
  
  trex_colidiu = loadImage("trex_collided.png");
  
  imagem_gameOver = loadImage("gameOver.png");
  
  imagem_Restart = loadImage("restart.png");
  
  somPulo = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somCheckpoint = loadSound("checkPoint.mp3")
}

// local da comfiguração padrão
function setup(){
  createCanvas(600,200)
  
 // camera.position.x = trex
 // camera.position.y = trex

  //camera.position.x = trex  
  //camera.position.y = trex   
  
  // displayWidth/2;
  //cars[index-1].y
  //console.log(mensagem);
  
  //criação dos grupos
  grupodeObstacolos = createGroup();
  grupodeNuvens = createGroup();
  
  //criar um sprite do trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addImage("colidiu",trex_colidiu)
  
  //adicionando escala e posição ao trex
  trex.scale = 0.5;
  trex.x = 50;
  
  //criar um sprite solo
  solo = createSprite(200,180,400,20);
  solo.addImage("solo",imagemsolo);
  solo.x = solo.width/2;
  
  //cria um sprite soloinvisivel  
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;//deixa o solo invisivel 
  
  //cria as bordas
  bordas =  createEdgeSprites();
  
  //trex.debug = true;
  //define o raio de colisão
  trex.setCollider("circle",0,0,40);
  
  gameOver = createSprite(300,95);
  gameOver.addImage(imagem_gameOver);
  
  restart = createSprite(300,140);
  restart.addImage(imagem_Restart);
  restart.scale = 0.5
}


function draw(){
  //muda a cor do fundo
  background("white");
  
  //console.log(mensagem);
  
  //exibição do placar na tela
  text("Pontuação:"+ placar,500,50)
  
  //estadojogo jogar 
  if(estadodojogo === JOGAR){
    //atualizasão do placar atrelado a quantidade de frames
     placar = placar + Math.round (frameCount/60);
    
//faz o trex saltar com a tecla espaço e quando ele esta em cima do solo
     if(keyDown("space") && trex.y >= 160){
      trex.velocityY = -10;
    //som do pulo
       somPulo.play()
       
      }

         
    //adição da gravidade (fazedo retornar ao solo)
     trex.velocityY = trex.velocityY + 0.5;
    
    //Faz o slo reiniciar
    if (solo.x <0){
    solo.x = solo.width/2;
      
  }
    
    gerarNuvens();
  
    gerarObstacolos();
    
 //velocidade do solo se mexendo
    solo.velocityX = -(4+placar/400);
    
    //deixa o game over e o restart invisivel
    gameOver.visible = false;
    restart.visible = false;
    
    //faz o som do checkpoint a cada 400 pontos
    if (placar > 0 && placar % 400 === 0){
      somCheckpoint.play();
      
    }

 
    // se o trex encostar nos obstacolos o estadojogo muda para encerrar
    if (trex.isTouching(grupodeObstacolos)){
      
      somMorte.play();
      
      estadodojogo = ENCERRAR;
    }
    
  }
  
  //quando o jogo entra no modo final
  else if (estadodojogo === ENCERRAR){
    
    //tira a velocidade de tudo
    solo.velocityX = 0;
    trex.velocityY = 0;
    
    grupodeObstacolos.setVelocityXEach(0);
    grupodeNuvens.setVelocityXEach(0);
   
    // faz com que os obstacolos e as nuvens permaneção na tela
    grupodeObstacolos.setLifetimeEach(-1);
    grupodeNuvens.setLifetimeEach(-1);
    
   
    //troca a imagem do trex
    trex.changeAnimation("colidiu",trex_colidiu);
    // coloca visibilidade para o game over e o restart
    gameOver.visible = true;
    restart.visible = true;
    
    reiniciar();
       
  }
    
  
  
  //mantem o trex no solo 
  trex.collide(soloinvisivel);

  
  
  //console.log (trex.y);
  
  //console.log (frameCount);
  
  
  
  drawSprites();
}
function gerarNuvens(){
  
  if(frameCount % 60 === 0){
    nuvem = createSprite(600,100,40,10);
    nuvem.velocityX = -3;
    nuvem.addImage(imagemNuvem);
    //definição da nuvem de forma aleatoria
    nuvem.y = Math.round(random(10,80));
    nuvem.scale = 0.8
    //ajuste da profundidade dos objetos
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    nuvem.lifetime = 210;
    grupodeNuvens.add(nuvem);
     }
    

  
}

function gerarObstacolos(){
  
  if(frameCount % 60 === 0){
    obstacolo = createSprite (600,165,10,40);
    //almenta a velocidade do obstacolo conforme o placar vai avançando
    obstacolo.velocityX = -(6+placar/400);
    //a escolha da exibição das imagens dos obstacolos de forma aleatoria  
    rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacolo.addImage(imagemObstacolo1);
        break;
      case 2: obstacolo.addImage(imagemObstacolo2); 
        break;
      case 3: obstacolo.addImage(imagemObstacolo3);  
        break;
      case 4: obstacolo.addImage(imagemObstacolo4); 
        break;
      case 5: obstacolo.addImage(imagemObstacolo5);  
        break;
      case 6: obstacolo.addImage(imagemObstacolo6); 
        break;
      default: break;
    }
    obstacolo.scale = 0.5
    obstacolo.lifetime = 300;
    camera.position.x = grupodeObstacolos;
    camera.position.y = grupodeObstacolos;
     grupodeObstacolos.add(obstacolo)
  }
  
}

function reiniciar(){
  // se o clicar
  if (mousePressedOver(restart)){
      
      estadodojogo = JOGAR;
      grupodeObstacolos.destroyEach();
      grupodeNuvens.destroyEach();
      trex.changeAnimation("running",trex_correndo);
      placar = 0;
      solo.velocityX = 0
      gameOver.visible = false;
      restart.visible = false;
       
       }
    
  }
  
  


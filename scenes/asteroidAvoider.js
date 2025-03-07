//  Declaração das variáveis utilizadas  
let player;
let asteroidesGrupo;
let cursors;
let botaoReiniciar;
let pontuacaoTexto;

let nivel = 0;
let pontuacao = 0;

let gameOver = false;


//  As diferentes dificuldades do jogo estão armazenadas nesse Array, permitindo a adição de um número maior de dificuldades futuramente
let dificuldade = [
    {numeroAsteroides: 1, velocidade: 200},
    {numeroAsteroides: 2, velocidade: 250},
    {numeroAsteroides: 3, velocidade: 300}
];

 class asteroidAvoider extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'asteroidAvoider',
        });
    }

       
    preload() {

        // Carrega as imagens
        this.load.image('espaco', 'assets/background.png'); 
        this.load.image('botaoReiniciar', 'assets/botaoReiniciar.png');

        // Carrega as spritesheets
        this.load.spritesheet('player', 'assets/naveSpritesheet.png', { frameWidth: 64, frameHeight: 48 });
        this.load.spritesheet('asteroide', 'assets/asteroideSpritesheet.png', { frameWidth: 32, frameHeight: 96 });
    }

    create() {

        gameOver = false;
        pontuacao = 0;
        nivel = 0;

        //  Adiciona o texto da pontuação no canto da tela
        pontuacaoTexto = this.add.text(0, 555, 'Pontuação: 0', { fontSize: '32px', fill: '#FFFFFF' }).setDepth(1);

        //  Cria as animações de morte do player e da movimentação do asteroide
        this.anims.create({

            key: 'explosaoPlayer',
      
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 11 }),
      
            frameRate: 6,  
                
            repeat: 0
            });
            
        this.anims.create({

            key: 'animacaoAsteroide',
      
            frames: this.anims.generateFrameNumbers('asteroide', { start: 0, end: 5 }),
      
            frameRate: 8,  
                
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys(); //    Adiciona os inputs das setinhas do teclado

        this.add.image(400,300, 'espaco'); //   Adiciona o background da fase

        player = this.physics.add.sprite(400, 500, 'player'); // Adição do player
        player.setCollideWorldBounds(true); //  Evita com que o player consiga sair pelos cantos da tela

        asteroidesGrupo = this.physics.add.group() //   Cria o grupo base dos asteroides, com físicas
        this.novosAsteroides(); //  Inicia a função para a criação dos asteróides
    }  

    novosAsteroides() {
        //  Cria um novo asteroide de acordo com o nível da dificuldade, usando o Array como base. No trecho dificuldade[nivel].numeroAsteroides: dificuldade se refere ao Array, [nivel]: a dificuldade do jogo guardada em uma varívavel (é por meio dela que o index certo do Array é verificado) e .numeroAsteroides ao valor guardado na parte específica do Array    
        for(let i = 0; i < dificuldade[nivel].numeroAsteroides; i++){
            
            let asteroide = asteroidesGrupo.create(Phaser.Math.Between(50, 750), 50, 'asteroide') //    A posição do asteroide no eixo x é randômica
            asteroide.setVelocity(0, dificuldade[nivel].velocidade); // A velocidade também depende da dificuldade
        
            asteroide.play('animacaoAsteroide');

            asteroide.saiuTela = false; // Marca que o asteroide ainda não saiu da tela

            // Verifica se o asteroide e o player colidiram
            this.physics.add.overlap(player, asteroide, () => {

                gameOver = true; // A variável gameOver passa a ser verdadeira, para evitar que novos asteroides sejam criados
                asteroide.destroy();
                player.anims.play('explosaoPlayer');
                this.physics.pause (); // A física do jogo é pausada, impedindo a movimentação em segundo plano

                //  Adição da mensagem alertando o jogador que ele morreu
                let mensagemMorte = this.add.text(290, 150, 'Você morreu!', { fontSize: '32px', fill: '#FFFFFF' }).setDepth(1);

                botaoReiniciar = this.add.image(400,300,'botaoReiniciar').setInteractive() //  Adição do botão de reinício
                botaoReiniciar.on('pointerdown', function (pointer){

                    //  Ocorre a troca de cenas
                    game.scene.stop('asteroidAvoider');
                    game.scene.start('menuInicial');
                });
            });
        } 
    }

    //  Movimentação do player
    update() {
        if (cursors.left.isDown)
            {
                player.setVelocityX(-300);

            }
            else if (cursors.right.isDown)
            {
                player.setVelocityX(300);
            }
            else
            {
                player.setVelocityX(0)
            }

        //  Verifica os asteroides presentes no grupo
        asteroidesGrupo.children.iterate(function(asteroide) {
            if(asteroide.y > 600 && asteroide.saiuTela == false) // Ocorre caso o asteroide ainda não tenha saído da tela e passou do limite estabelecido do eixo y
            {
                asteroide.saiuTela = true;
                asteroide.disableBody(true, true); //  O asteroide é desligado
                pontuacao = pontuacao + 50; //  Aumento da pontuação
                pontuacaoTexto.setText('Pontuação: ' + pontuacao);  //  Registro da mudança no placar
            }
        })

        //  Verifica se é necessário aumentar a dificuldade
        if(pontuacao >= 200){

            if(pontuacao >= 600){
                nivel = 2;
            }

            else
            {
                nivel = 1;
            }
        }

        //Caso o número de asteroides na tela seja zero, e o player ainda não tiver morrido, novos asteroides serão criados
        if (asteroidesGrupo.countActive(true) === 0 && gameOver == false){

            this.novosAsteroides();
        }
    }        
}


class menuInicial extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'menuInicial',
        });
    }

    // Carrega as imagens
    preload() {
        this.load.image("background", "assets/telaInicial.png"); 
        this.load.image("botao", "assets/botaoIniciar.png")
    }

    create() {
    this.add.image(400,300, "background");
    let botao = this.add.image(400, 200, "botao").setInteractive();

    //  Verifica se o botão de iniciar o jogo foi pressionado
    botao.on('pointerdown', function (pointer){
        game.scene.stop('menuInicial');
        game.scene.start('asteroidAvoider');
        });
    } 
}

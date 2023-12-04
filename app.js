class Game {
    // propiedades de la clase 

    snake = [];
    food = null;
    director = null;
    direction = 3;
    sizeSquare = 10;
    canvas = null;
    isLost = false;
    detailDirection = ["", "Arriba", "Derecha", "Abajo", "Izquierda", "restart"];

    head = new Image();
    tail = new Image();
    apple = new Image();
    lose = new Image();

    // constructor del objeto 

    constructor(txtButton, txtState, canvas) {
        this.txtButton = txtButton;
        this.txtState = txtState;
        this.canvas = canvas;
        this.contexto = this.canvas.getContext("2d");

        this.head.src = "media/point.png";
        this.tail.src = "media/cuerpo.png";
        this.apple.src = "media/appleTwo.jpeg";
        this.lose.src = "media/lose.jpeg";
        this.canvas.width = 300; // Establecer el ancho del canvas
        this.canvas.height = 300; //

    }

    // funcion de arranque 

    init() {
        // crear snake o cabeza de la serpiente
        let square = new Object();
        square.X = 15;
        square.Y = 15;
        square.X_old = 15;
        square.Y_old = 15;

        // agregamos el objeto al array snake
        this.snake.push(square);

        // agregar evento de teclado y validar 
        document.addEventListener("keypress", (e) => {
            this.printKey(e.key);

            switch (e.key) {
                case 'w':
                    if (this.direction != 3)
                        this.direction = 1;
                    break;
                case 'd':
                    if (this.direction != 4)
                        this.direction = 2;
                    break;
                case 's':
                    if (this.direction != 1)
                        this.direction = 3;
                    break;
                case 'a':
                    if (this.direction != 2)
                        this.direction = 4;
                    break;
                case 'Enter':
                    this.restart(); // Llamar al método restart al presionar Enter
                    break;
            }
        });

        // propiedad director / ciclo / reglas
        this.director = setInterval(() => {
            this.rules();
            if (!this.isLost) {
                this.next();
                this.show();
            } else {
                clearInterval(this.director);
                this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.contexto.drawImage(this.lose, 0, 0, this.canvas.width, this.canvas.height);
            }
        }, 100);
    }

    // funcion next / comportamiento del juego 
    next() {
        this.printDirection();
        if (this.food == null)
            this.getFood();

        // asignar posicion a la serpiente
        this.snake.map((square, index) => {
            square.X_old = square.X;
            square.Y_old = square.Y;

            // Mover la cabeza
            if (index === 0) {
                switch (this.direction) {
                    case 1:
                        square.Y--;
                        break;
                    case 2:
                        square.X++;
                        break;
                    case 3:
                        square.Y++;
                        break;
                    case 4:
                        square.X--;
                        break;
                }
            }
        });

        this.snake.map((square, index, snake_)=>{
            if(index != 0){
                square.X = snake_[index - 1].X_old;
                square.Y = snake_[index - 1].Y_old;
            }
        }) 

        if (this.food != null) {
            this.isEating();
        }
    }

    // funcion mostrar serpiente 
    show() {
        this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.snake.map((square, index) => {
            if (index == 0) {
                this.contexto.drawImage(this.head,
                    square.X * this.sizeSquare,
                    square.Y * this.sizeSquare,
                    this.sizeSquare,
                    this.sizeSquare
                );
            } else {
                this.contexto.drawImage(this.tail,
                    square.X * this.sizeSquare,
                    square.Y * this.sizeSquare,
                    this.sizeSquare,
                    this.sizeSquare
                );
            }
            if (this.food != null) {
                this.contexto.drawImage(
                    this.apple,
                    this.food.X * this.sizeSquare,
                    this.food.Y * this.sizeSquare,
                    this.sizeSquare,
                    this.sizeSquare
                );
            }
        });
    }

    restart() {
        clearInterval(this.director);
        this.snake = [];
        this.food = null;
        this.isLost = false;
        this.direction = 3;

        // Crear snake o cabeza de la serpiente
        let square = new Object();
        square.X = 15;
        square.Y = 15;
        square.X_old = 15;
        square.Y_old = 15;

        // Agregamos el objeto al array snake
        this.snake.push(square);

        // Reiniciar el intervalo del juego
        this.director = setInterval(() => {
            this.rules();
            if (!this.isLost) {
                this.next();
                this.show();
            } else {
                clearInterval(this.director);
                this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.contexto.drawImage(this.lose, 0, 0, this.canvas.width, this.canvas.height);
            }
        }, 100);
    }

    rules(){
        for (let j = 0; j < this.snake.length; j++){
            for (let i = 0; i < this.snake.length; i++){
                if(j != i){
                    if(
                        this.snake[j].X == this.snake[i].X &&
                        this.snake[j].Y == this.snake[i].Y
                    ){
                        this.isLost = true;
                    }
                }
            }
        }
        if(this.snake[0].X >= 30 || this.snake[0].X < 0 ||
            this.snake[0].Y >= 30 || this.snake[0].Y < 0){
                this.isLost = true;
        }
    }
    
    // funcion comiendo  
    isEating() {
        if (this.snake[0].X == this.food.X && this.snake[0].Y == this.food.Y) {
            this.food = null;
            let square = new Object();
            square.X = this.snake[this.snake.length - 1].X_old;
            square.Y = this.snake[this.snake.length - 1].Y_old;
            this.snake.push(square);
        }
    }

    // funcion obtener comida de forma aleatoria;
    getFood() {
        let square = new Object();
        square.X = Math.floor(Math.random() * 30);
        square.Y = Math.floor(Math.random() * 30);
        this.food = square;
    }

    // funcion helper 
    printDirection() {
        this.txtState.value = this.detailDirection[this.direction];
    }

    // funcion para mostrar datos en el input 
    printKey(text) {
        this.txtButton.value = text;
    }
}

// crear el objeto 

const gameObj = new Game(
    document.getElementById("txtButton"),
    document.getElementById("txtState"),
    document.getElementById("canvas")
);
gameObj.init();

const app = {

  boardRows: 70, // Défini le nombre de ligne
  boardCols: 90, // Défini le nombre de colone

  playGame: true,

  boardGame: [], // Le plateau de jeu
  nextBoardGame: [], // Le plateau de la génération suivante

  reproductionTime: 100, // Défini le temps entre chaque génération

  /***************************
   * L'entré de l'application
   ***************************/
  init: function() {
    app.createBoardgame();
    app.initBoardGame();
    app.resetGameBoard();
    app.resetNextBoardGame();

    const playButton = document.getElementById('play');
    const clearButton = document.getElementById('clear');

    playButton.addEventListener('click', app.handleStartGame);
    clearButton.addEventListener('click', app.handleClearBoardGame);
  },

  /*****************
   * Créé la grille
   *****************/
  initBoardGame: function() {

    app.boardGame = new Array(app.boardRows);
    app.nextBoardGame = new Array(app.boardRows);

    // Je boucle pour créé la grille
    for (let index = 0; index < app.boardRows; index++) {
      
      app.boardGame[index] = new Array(app.boardCols);
      app.nextBoardGame[index] = new Array(app.boardCols);
    }
  },

  /******************
   * Reset la grille
   ******************/
  resetGameBoard: function() {

    for (let row = 0; row < app.boardRows; row++) {
      
      for (let col = 0; col < app.boardCols; col++) {
        
        app.boardGame[row][col] = 0;
        app.nextBoardGame[row][col] = 0;
      }
    }
  },

  /***************************
   * Reset La grille suivante
   ***************************/
  resetNextBoardGame: function() {

    for (let row = 0; row < app.boardRows; row++) {
      
      for (let col = 0; col < app.boardCols; col++) {
        
        app.boardGame[row][col] = app.nextBoardGame[row][col];
        app.nextBoardGame[row][col] = 0;
      }
    }
  },

  /******************************
   * Créé la grille dans le HTML
   ******************************/
  createBoardgame: function() {

    const element = document.getElementById('gameBoard');
    const table = document.createElement('table');

    for (let row = 0; row < app.boardRows; row++) {
      
      const tr = document.createElement('tr');

      for (let col = 0; col < app.boardCols; col++) {
        
        const td = document.createElement('td');

        td.setAttribute('id', row + '_' + col);
        td.setAttribute('class', 'dead');
        td.addEventListener('click', this.handleClick); // J'écoute l'evenement click
        tr.appendChild(td);
      }

      table.appendChild(tr);
    }

    element.appendChild(table);
  },

  /**********************************************
   * Ajoute une cellule à la position du curseur
   **********************************************/
  handleClick: function(evt) {

    const cellule = evt.target;
    const splitIdCellule = cellule.getAttribute('id').split('_');
    
    const row = splitIdCellule[0];
    const col = splitIdCellule[1];

    const classCellule = cellule.getAttribute('class');

    if (classCellule.indexOf('life') > -1) {

      cellule.setAttribute('class', 'dead');
      app.boardGame[row][col] = 0;

    } else {

      cellule.setAttribute('class', 'life');
      app.boardGame[row][col] = 1;
    }
  },

  /************************
   * Met à jour la cellule
   ************************/
  cellupdate: function() {

    for (let row = 0; row < app.boardRows; row++) {
      
      for (let col = 0; col < app.boardCols; col++) {
        
        const cellule = document.getElementById(`${row}_${col}`);

        if (app.boardGame[row][col] === 0) {

          cellule.setAttribute('class', 'dead');

        } else {

          cellule.setAttribute('class', 'life');
        }
      }
    }
  },

  /***************************************************
   * Néttoye le plateau du jeu au click sur le bouton
   ***************************************************/
  handleClearBoardGame: function() {

    app.playGame = false;

    const cellsList = document.getElementsByClassName('life');

    const cells = [];

    for (let index = 0; index < cellsList.length; index++) {
      
      cells.push(cellsList[index]);
    }

    for (let index = 0; index < cells.length; index++) {
      
      cells[index].setAttribute('class', 'dead');
    }

    app.resetGameBoard();
  },

  /**************************************
   * Lance le jeu au click sur le bouton
   **************************************/
  handleStartGame: function() {

    app.nextGenCellule();

    let timer;

    if (app.playGame) {

      timer = setTimeout(app.handleStartGame, app.reproductionTime);

    } else {

      clearTimeout(timer);

      app.playGame = true;
    }
  },

  /********************************************
   * Lance la génération suivante des cellules
   ********************************************/
  nextGenCellule: function(time) {

    for (let row = 0; row < app.boardRows; row++) {
      
      for (let col = 0; col < app.boardCols; col++) {
        
        app.applyRule(row, col);
      }
    }

    app.resetNextBoardGame();
    app.cellupdate();
  },

  /***********************************
   * Applique les règles des cellules
   ***********************************/
  applyRule: function(row, col) {

    const numNeighbors = app.countNeighbors(row, col);

    if (app.boardGame[row][col] === 1) {

      if (numNeighbors < 2) {

        app.nextBoardGame[row][col] = 0;

      } else if (numNeighbors === 2 || numNeighbors === 3) {

        app.nextBoardGame[row][col] = 1;

      } else if (numNeighbors > 3) {

        app.nextBoardGame[row][col] = 0;
      }

    } else if (app.boardGame[row][col] === 0) {

      if (numNeighbors === 3) {
        
        app.nextBoardGame[row][col] = 1;
      }
    }
  },

  /******************************************
   * Permet de compter les cellules voisines
   ******************************************/
  countNeighbors: function(row, col) {

    let count = 0;

    if (row -1 >= 0) {

      if (app.boardGame[row -1][col] === 1) {
        count++;
      }
    }

    if (row -1 >= 0 && col -1 >= 0) {

      if (app.boardGame[row -1][col -1] === 1) {
        count++;
      }
    }

    if (row -1 >= 0 && col +1 < app.boardCols) {

      if (app.boardGame[row -1][col +1] === 1) {
        count++;
      }
    }

    if (col -1 >= 0) {

      if (app.boardGame[row][col -1] == 1) {
        count++;
      }
    }

    if (col +1 < app.boardCols) {

      if (app.boardGame[row][col +1] === 1) {
        count++;
      }
    }

    if (row +1 < app.boardRows) {
      
      if (app.boardGame[row +1][col] === 1) {
        count++;
      }
    }

    if (row +1 < app.boardRows && col -1 >= 0) {

      if (app.boardGame[row +1][col -1] === 1) {
        count++;
      }
    }

    if (row +1 < app.boardRows && col +1 < app.boardCols) {

      if (app.boardGame[row +1][col +1] === 1) {
        count++;
      }
    }

    return count;
  }
}

document.addEventListener('DOMContentLoaded', app.init);
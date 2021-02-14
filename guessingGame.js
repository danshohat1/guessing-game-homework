
const ELEMENTS = {
    createPlayerBtn: $('#add-player-btn'),
    createGaneBtn : $('#create-game-btn'),
}

let numberWinner = 0;

// Inputs
const playerGuess = $("#guess");
const playerName = $("#name");

//create an array of all the names 
const names = [];

// game object
let game = {
    id: '',
    players: [],
    isOver: false,
    result: null,
    winner: null,
}
//players array
const players = [];


//create game function
ELEMENTS.createGaneBtn.click( () => {
        $("#heading").remove();
        $("#createPlayers").css("visibility" , "visible");
        $("#createPlayers").addClass("on-screen");
        $.ajax({
            method: 'POST',
            url: 'https://chen-guessing-game.herokuapp.com/guessing-game/',
            success: (data) => {
                console.log('Game id is:', data.id)
                game.id = data.id
            },
            error: () => (console.error("There was an error"))
        }) 
  
});


//create player function
ELEMENTS.createPlayerBtn.click( ()=> {
    if ( playerName.val() !== "" && 100 > parseInt(playerGuess.val()) > 0){
        playerObj = {"name" : playerName.val(), "guess":  parseInt(playerGuess.val())}
        $.ajax({
            method: 'POST',
            url: `https://chen-guessing-game.herokuapp.com/guessing-game/${game.id}/player`,
            data: JSON.stringify(playerObj),
            contentType: 'application/json',
            success: (data) => {
                players.push(playerObj);
                console.log(players , data)

                names.push(playerObj.name)

                $("#current-players").text("Current Players: " + names.join(", "))

                playerName.val("");
                playerGuess.val("") ;
            },
            error: () => (console.error("There was an error"))
        })
    }

    if (players.length === 1){
        const playBtn = createButton("Play Game!");

        playBtn.classList.add("add-player-btns");

        $("#createPlayers").append(playBtn);

        startGameFunction(playBtn)
    }
  
});

// start game button
function startGameFunction(playBtn) {

    playBtn.addEventListener("click", () => {
        $.ajax({
            method: "POST",
            url: `https://chen-guessing-game.herokuapp.com/guessing-game/${game.id}/start`,
            data: JSON.stringify(players),
            contentType: 'application/json',
            success: (data) =>{
                console.log(data)
                game = data;

                $("#createPlayers").remove()


                $("#results").removeClass("hidden");
                $("#results").addClass("on-screen");
                $("#numberResult").text("the result is: " + game.result)
                $("#winner").text("the winner is: " + game.winner.name)           
            }
        })
    
    })
}


function createButton(text){
    const button = document.createElement("button");

    button.classList.add("btn");
    button.classList.add("btn-primary");

    button.innerText = text;

    return button
}


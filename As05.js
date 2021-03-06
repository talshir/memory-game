//Modal functions
function showRules() {
    document.getElementById("rules").style.display = "block";
}
function closeModal() {
    var mod = document.getElementsByClassName("modal");
    for (var i = 0; i < mod.length; i++) {
        mod[i].style.display = "none";
    }
}
function endGame() {
    document.getElementById("winner").style.display = "block";
}

//Timer funtions
var checkTime = function (i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
var initializeTimer = function(){
    m=0;
    s=0;
    s=checkTime(s);
    document.getElementById("time").innerHTML = m + ":" + s;
}
var countUp = function () {
    s++;
    if (s >= 60) {
        s = 0;
        m++;
    }
    s = checkTime(s);
    document.getElementById("time").innerHTML = m + ":" + s;
}
var startTime = function () {
    t = setInterval(countUp, 1000);
}
var stopTime = function () {
    clearInterval(t);
}

//Game
function newGame() {
    //set-up
    function shuffleDeck(array) {
        var n = array.length;
        while (n) {
            var i = Math.floor(Math.random() * n--);
            var temp = array[n];
            array[n] = array[i];
            array[i] = temp;
        }
        return array;
    }
    //variables
    var difficulty = document.getElementById('gameLevel').value;
    var cardBank = easyPack;
    var wrong = 0;
    var counter = 0;
    var winCondition;
    var cardSize;
    var card1;
    var card2;
    
    //clear existing board
    var board = document.getElementById("gameboard");
    while (board.hasChildNodes()) {
        board.removeChild(board.firstChild);
    }
    //handle level selection
    if (difficulty === "Easy") {
        winCondition = 12;
        cardSize = "card1";
        document.getElementById("gameboard").style.width = "1100px";
    } else if (difficulty === "Medium") {
        winCondition = 18;
        cardSize = "card2";
        document.getElementById("gameboard").style.width = "1300px";
        var medPack = ["shark07", "shark08", "shark09"];
        for (var i = 0; i < cardBank.length; i++) {
            medPack.push(cardBank[i]);
        }
        cardBank = medPack;
    } else if (difficulty === "Hard") {
        winCondition = 24;
        cardSize = "card3";
        document.getElementById("gameboard").style.width = "1150px";
        var hardPack = ["shark07", "shark08", "shark09", "shark10", "shark11", "shark12"];
        for (var i = 0; i < cardBank.length; i++) {
            hardPack.push(cardBank[i]);
        }
        cardBank = hardPack;
    }
    for (var i = 0; i < 2; i++) {
        //randomize card distribution
        shuffleDeck(cardBank);
        for (var j = 0; j < cardBank.length; j++) {
            var card = document.createElement('div');
            card.className = cardBank[j] + " inPlay card " + cardSize;
            card.style.backgroundImage = "url(./images/background.jpg)";
            card.addEventListener("click", gamePlay);
            board.appendChild(card);
        }
    }
    //game play
    function flip() {
        card1.style.backgroundImage = "url(./images/background.jpg)";
        card1.classList.add("inPlay");
        card2.style.backgroundImage = "url(./images/background.jpg)";
        card2.classList.add("inPlay");
        resumePlay();
    }
    function resumePlay() {
        var deck = document.getElementsByClassName("inPlay");
        for (var j = 0; j < deck.length; j++) {
            deck[j].addEventListener("click", gamePlay);
        }
    }
    //handle matching flipped cards
    function cardMatch() {
        card1.classList.add("matched");
        card2.classList.add("matched");
        var matches = document.getElementsByClassName("matched");
        resumePlay();
        //Handle game completion
        if (matches.length === winCondition) {
            stopTime();
            var completionTime = document.getElementById("time").innerHTML;
            document.getElementById("guesses").textContent = "You completed the game in " + completionTime + " minutes with "+wrong+" wrong guesses.";
            endGame();
        }
    }
    function gamePlay() {
        counter++;
        event.target.classList.remove("inPlay");
        event.target.removeEventListener("click", gamePlay);
        //show appropriate image on selected cards
        if (counter % 2 != 0) {
            card1 = event.target
            back1 = event.target.classList.item(0);
            event.target.style.backgroundImage = "url(./images/" + back1 + ".jpg)";
        } else {
            card2 = event.target;
            back2 = event.target.classList.item(0);
            event.target.style.backgroundImage = "url(./images/" + back2 + ".jpg)";
            //handle game pause on two flipped cards
            var deck = document.getElementsByClassName("card");
            for (var i = 0; i < deck.length; i++) {
                deck[i].removeEventListener("click", gamePlay);
            }
            if (back1 === back2) {
                //if cards match
                setTimeout(cardMatch, 1000);
            } else {
                //resume play
                wrong++;
                setTimeout(flip, 1000);
            }
        }
    }
}

//HTML
var initializeGame = function () {
    var header = document.createElement('div');
    header.id = "header";
    document.body.appendChild(header);
    var nav = document.createElement('div');
    nav.id = "nav";
    header.appendChild(nav);
    var menu = ["New Game", "Rules"];
    for (var i = 0; i < menu.length; i++) {
        var link = document.createElement('a');
        link.id = menu[i];
        link.class = "header";
        link.textContent = menu[i];
        nav.appendChild(link);
    }
    //Level selection
    var dropDown = document.createElement('select');
    dropDown.id = "gameLevel";
    nav.appendChild(dropDown);
    var levels = ["Easy", "Medium", "Hard"];
    for (var i = 0; i < levels.length; i++) {
        var level = document.createElement('option');
        level.innerHTML = levels[i];
        level.value = levels[i];
        dropDown.appendChild(level);
    }
     //Timer
     var timer = document.createElement('div');
     timer.id = "time";
     nav.appendChild(timer);

    //Deliniation
    var pageBreak = document.createElement('hr');
    document.body.appendChild(pageBreak);

    //Game board
    var game = document.createElement('div');
    game.id = "gameboard";
    document.body.appendChild(game);
}
//global variables
var t;
var m=0;
var s=0;
var easyPack = ["shark01", "shark02", "shark03", "shark04", "shark05", "shark06"];

//initialize webpage
initializeGame();
initializeTimer();

//HTML event listeners
document.getElementById("New Game").addEventListener("click", function () {
    newGame();
    stopTime();
    initializeTimer();
    startTime();
});
document.getElementById("Rules").addEventListener("click", showRules);
document.getElementById("close").addEventListener("click", closeModal);
document.getElementById("playAgain").addEventListener("click",function(){
    newGame();
    initializeTimer();
    closeModal();
    startTime();
});
document.getElementById("exit").addEventListener("click", function () {
    window.close();
});

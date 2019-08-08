var board = document.getElementById("board");
var colorSquares = document.querySelectorAll(".square div");
var levelDisplay = document.getElementById("level");
var startButton = document.getElementById("start");
var messageDisplay = document.getElementById("message");

var gameInProgress = false;
var delay = 500;
var colors = [];
var stage = 0;
var canClick = false;

var audioCtx = new(window.AudioContext || window.webkitAudioContext || window.audioContext);
var notes = [330, 880, 554, 659];

for (var i = 0; i < colorSquares.length; i++) {
    colorSquares[i].addEventListener("click", selectColor);
}

startButton.addEventListener("click", start);

function selectColor() {
    if (canClick) {
        var colorNumber = parseInt(this.getAttribute("id").replace("color", ""), 10);
        beep(delay / 2, notes[colorNumber]);

        if (colorNumber == colors[stage]) {
            stage++;

            if (stage == colors.length) {
                canClick = false;
                board.classList.remove("can-click");
                messageDisplay.innerHTML = "Good job";

                if (colors.length >= 15) {
                    delay = 200;
                }
                else if (colors.length >= 10) {
                    delay = 300;
                }
                else if (colors.length >= 5) {
                    delay = 400;
                }

                stage = 0;
                setTimeout(pickColor, 1000);
            }
        }
        else {
            gameInProgress = false;
            startButton.disabled = false;

            canClick = false;
            board.classList.remove("can-click");
            messageDisplay.innerHTML = "You lose";
        }
    }
}

function start() {
    if (!gameInProgress) {
        gameInProgress = true;
        startButton.disabled = true;

        delay = 500;
        colors = [];
        stage = 0;
        pickColor();
    }
}

function pickColor() {
    canClick = false;
    board.classList.remove("can-click");
    messageDisplay.innerHTML = "Just watch";

    var randomNumber = Math.floor(Math.random() * 4);
    colors.push(randomNumber);
    levelDisplay.innerHTML = "Level " + colors.length;

    for (var i = 0; i < colors.length; i++) {
        setTimeout(highlightColor, i * delay, i);
    }
}

function highlightColor(i) {
    var colorNumber = colors[i];
    colorSquares[colorNumber].classList.add("highlighted");
    beep(delay / 2, notes[colorNumber]);

    setTimeout(clearColor, delay / 2, i);
}

function clearColor(i) {
    var colorNumber = colors[i];
    colorSquares[colorNumber].classList.remove("highlighted");

    if (i == colors.length - 1) {
        canClick = true;
        board.classList.add("can-click");
        messageDisplay.innerHTML = "Now click";
    }
}

//All arguments are optional:
//duration of the tone in milliseconds. Default is 500
//frequency of the tone in hertz. default is 440
//volume of the tone. Default is 1, off is 0.
//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone
function beep(duration, frequency, volume, type, callback) {
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (volume) { gainNode.gain.value = volume; }
    if (frequency) { oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); }
    if (type) { oscillator.type = type; }
    if (callback) { oscillator.onended = callback; }

    oscillator.start();
    setTimeout(function() { oscillator.stop() }, (duration ? duration : 500));
}

let grid = document.getElementById(`grid`)
let squares = document.getElementsByClassName(`square`)
let levelDisplay = document.getElementById(`levelDisplay`)
let startButton = document.getElementById(`startButton`)
let messageParagraph = document.getElementById(`messageParagraph`)

let audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext)()

let notes = {
  square1: 330,
  square2: 880,
  square3: 554,
  square4: 659,
}

let delay
let selectedSquares
let stage

startButton.addEventListener(`click`, startGame)

for (let square of squares) {
  square.addEventListener(`click`, clickSquare)
}

function startGame() {
  startButton.disabled = true

  delay = 500
  selectedSquares = []
  stage = 0
  pickSquare()
}

function pickSquare() {
  let randomNumber = Math.floor(Math.random() * squares.length)
  let randomSquare = squares[randomNumber]
  selectedSquares.push(randomSquare)

  levelDisplay.innerHTML = `Level ${selectedSquares.length}`
  messageParagraph.innerHTML = `Just watch`

  for (let i = 0; i < selectedSquares.length; i++) {
    setTimeout(highlightSquare, i * delay, i)
  }
}

function highlightSquare(i) {
  let square = selectedSquares[i]
  square.classList.add(`highlighted`)
  beep(delay / 2, notes[square.id])

  setTimeout(clearSquare, delay / 2, i)
}

function clearSquare(i) {
  let square = selectedSquares[i]
  square.classList.remove(`highlighted`)

  if (i == selectedSquares.length - 1) {
    grid.classList.add(`clickable`)
    messageParagraph.innerHTML = `Now click`
  }
}

function clickSquare() {
  if (grid.classList.contains(`clickable`)) {
    beep(delay / 2, notes[this.id])

    if (this == selectedSquares[stage]) {
      goodClick()
    } else {
      badClick()
    }
  }
}

function goodClick() {
  stage++

  if (stage == selectedSquares.length) {
    grid.classList.remove(`clickable`)
    messageParagraph.innerHTML = `Good job`

    if (selectedSquares.length >= 15) {
      delay = 200
    } else if (selectedSquares.length >= 10) {
      delay = 300
    } else if (selectedSquares.length >= 5) {
      delay = 400
    }

    stage = 0
    setTimeout(pickSquare, 1000)
  }
}

function badClick() {
  grid.classList.remove(`clickable`)
  messageParagraph.innerHTML = `You lose`

  startButton.disabled = false
}

// All arguments are optional:
// duration of the tone in milliseconds. Default is 500
// frequency of the tone in hertz. default is 440
// volume of the tone. Default is 1, off is 0.
// type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
// callback to use on end of tone
function beep(duration, frequency, volume, type, callback) {
  let oscillator = audioCtx.createOscillator()
  let gainNode = audioCtx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  if (volume) {
    gainNode.gain.value = volume
  }
  if (frequency) {
    oscillator.frequency.value = frequency
  }
  if (type) {
    oscillator.type = type
  }
  if (callback) {
    oscillator.onended = callback
  }

  oscillator.start(audioCtx.currentTime)
  oscillator.stop(audioCtx.currentTime + (duration || 500) / 1000)
}

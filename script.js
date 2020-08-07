let grid = document.getElementById(`grid`)
let squares = document.getElementsByClassName(`square`)
let levelDisplay = document.getElementById(`levelDisplay`)
let startButton = document.getElementById(`startButton`)
let messageParagraph = document.getElementById(`messageParagraph`)

let audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext)
let notes = [330, 880, 554, 659]

let delay
let colorNumbers
let stage

startButton.addEventListener(`click`, startGame)

for (let square of squares) {
  square.addEventListener(`click`, clickSquare)
}

function startGame() {
  startButton.disabled = true

  delay = 500
  colorNumbers = []
  stage = 0
  pickColor()
}

function pickColor() {
  messageParagraph.innerHTML = `Just watch`

  let randomNumber = Math.floor(Math.random() * 4)
  colorNumbers.push(randomNumber)
  levelDisplay.innerHTML = `Level ${colorNumbers.length}`

  for (let i = 0; i < colorNumbers.length; i++) {
    setTimeout(highlightColor, i * delay, i)
  }
}

function highlightColor(i) {
  let colorNumber = colorNumbers[i]
  squares[colorNumber].classList.add(`highlighted`)
  beep(delay / 2, notes[colorNumber])

  setTimeout(clearColor, delay / 2, i)
}

function clearColor(i) {
  let colorNumber = colorNumbers[i]
  squares[colorNumber].classList.remove(`highlighted`)

  if (i == colorNumbers.length - 1) {
    grid.classList.add(`clickable`)
    messageParagraph.innerHTML = `Now click`
  }
}

function clickSquare() {
  if (grid.classList.contains(`clickable`)) {
    let colorNumber = Number(this.id[1])
    beep(delay / 2, notes[colorNumber])

    if (colorNumber == colorNumbers[stage]) {
      goodClick()
    }
    else {
      badClick()
    }
  }
}

function goodClick() {
  stage++

  if (stage == colorNumbers.length) {
    grid.classList.remove(`clickable`)
    messageParagraph.innerHTML = `Good job`

    if (colorNumbers.length >= 15) {
      delay = 200
    }
    else if (colorNumbers.length >= 10) {
      delay = 300
    }
    else if (colorNumbers.length >= 5) {
      delay = 400
    }

    stage = 0
    setTimeout(pickColor, 1000)
  }
}

function badClick() {
  grid.classList.remove(`clickable`)
  messageParagraph.innerHTML = `You lose`

  startButton.disabled = false
}

//All arguments are optional:
//duration of the tone in milliseconds. Default is 500
//frequency of the tone in hertz. default is 440
//volume of the tone. Default is 1, off is 0.
//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone
function beep(duration, frequency, volume, type, callback) {
  let oscillator = audioCtx.createOscillator()
  let gainNode = audioCtx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  if (volume) { gainNode.gain.value = volume }
  if (frequency) { oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime) }
  if (type) { oscillator.type = type }
  if (callback) { oscillator.onended = callback }

  oscillator.start()
  setTimeout(function() { oscillator.stop() }, (duration ? duration : 500))
}
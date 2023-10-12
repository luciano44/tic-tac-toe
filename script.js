const state = {
  turn: "X",
  totalBoxesChecked: 0,
  winner: "",
  Xscore: 0,
  Oscore: 0,
}
const game = document.querySelector(".game")
const container = document.querySelector(".container")
const boxes = document.querySelectorAll(".container > div")

const leftScore = document.querySelector(".left-score p")
const rightScore = document.querySelector(".right-score p")

const muteBtnImg = document.querySelector("#mute")
const restartBtnImg = document.querySelector("#restart")

const errorAudio = document.querySelector("#error-audio")
const OAudio = document.querySelector("#o-audio")
const XAudio = document.querySelector("#x-audio")
const endAudio = document.querySelector("#end-audio")
const drawAudio = document.querySelector("#draw-audio")
const audios = document.querySelectorAll("audio")

let currSetTimeout
let muted = false

audios.forEach((aud) => (aud.volume = 0.2))

function addWinnerScore() {
  if (state.winner === "O") {
    state.Oscore += 1
    rightScore.textContent = state.Oscore
  }
  if (state.winner === "X") {
    state.Xscore += 1
    leftScore.textContent = state.Xscore
  }
}

function checkWinner() {
  const [a, b, c, d, e, f, g, h, i] = boxes
  let thereIsAWinner = false

  function checkEqualityAndWinner(el1, el2, el3) {
    thereIsAWinner =
      el1.getAttribute("checked") === el2.getAttribute("checked") &&
      el1.getAttribute("checked") === el3.getAttribute("checked") &&
      el1.getAttribute("checked") !== ""

    if (!thereIsAWinner) return

    state.winner = state.turn

    playAudio(endAudio)
    endGame()

    // restart()

    el1.classList.add("winner")
    el2.classList.add("winner")
    el3.classList.add("winner")

    return
  }

  // --- CHECKING WINNER ---

  //ROW
  checkEqualityAndWinner(a, b, c)
  checkEqualityAndWinner(d, e, f)
  checkEqualityAndWinner(g, h, i)

  //COLUMN
  checkEqualityAndWinner(a, d, g)
  checkEqualityAndWinner(b, e, h)
  checkEqualityAndWinner(c, f, i)

  //HORIZONTAL
  checkEqualityAndWinner(a, e, i)
  checkEqualityAndWinner(c, e, g)

  addWinnerScore()

  // DRAW
  if (state.totalBoxesChecked === 9 && !state.winner) {
    playAudio(drawAudio)
    boxes.forEach((box) => box.classList.add("draw"))
    endGame()
  }
}

function mute() {
  if (muted) {
    muteBtnImg.src = "./imgs/volume.svg"
  } else {
    muteBtnImg.src = "./imgs/mute.svg"
  }

  muted = !muted
}

function endGame() {
  game.setAttribute("disabled", "")
  restartBtnImg.src = "./imgs/must-restart.svg"
  restartBtnImg.classList.add("jump-anim")
}

function startGame() {
  boxes.forEach((box) => {
    box.classList.remove("winner")
    box.classList.remove("draw")
  })
  restartBtnImg.classList.remove("jump-anim")
  restartBtnImg.src = "./imgs/restart.svg"

  game.removeAttribute("disabled")
  container.style.opacity = "1"
  boxes.forEach((box) => box.setAttribute("checked", ""))
  state.turn = "X"
  state.winner = ""
  state.totalBoxesChecked = 0
  document.querySelector(".turn img").src = `./imgs/X.svg`
}

function playAudio(audio) {
  if (muted) return
  audio.currentTime = 0
  audio.play()
}

function switchTurn() {
  state.turn = state.turn === "X" ? "O" : "X"
  document.querySelector(".turn").classList.remove("fadeup")
  setTimeout(() => {
    document.querySelector(".turn").classList.add("fadeup")
  }, 50)
  document.querySelector(".turn img").src = `./imgs/${state.turn}.svg`
}

function checkBox(box) {
  // IF BOX IS ALREADY CHECKED
  if (box.getAttribute("checked")) {
    if (currSetTimeout) {
      clearTimeout(currSetTimeout)
    }
    playAudio(errorAudio)
    game.style.animation = "shake 0.1s infinite linear alternate"
    box.classList.add("error")
    currSetTimeout = setTimeout(() => {
      game.style.animation = "none"
    }, 250)
    setTimeout(() => {
      box.classList.remove("error")
    }, 250)
    return
  }
  box.setAttribute("checked", state.turn)
  state.totalBoxesChecked += 1

  state.turn === "X" ? playAudio(XAudio) : playAudio(OAudio)
  checkWinner()
  switchTurn()

  if ((state.turn === "O" && !state.winner) || !state.totalBoxesChecked) {
    BOTplay()
  }
}

function BOTplay() {
  setTimeout(() => {
    if (state.totalBoxesChecked < 1) return
    const allUnchekedBoxes = document.querySelectorAll('[checked=""]')
    const randomNumber = Math.ceil(Math.random() * allUnchekedBoxes.length - 1)
    checkBox(allUnchekedBoxes[randomNumber])
    if (!state.winner || !state.totalBoxesChecked)
      game.removeAttribute("disabled")
  }, 500)
  game.setAttribute("disabled", "")
}

boxes.forEach((box) =>
  box.addEventListener("click", () => {
    checkBox(box)
  })
)

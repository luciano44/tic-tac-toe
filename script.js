const state = {
  turn: "X",
  totalBoxesChecked: 0,
  winner: "",
  Xscore: 0,
  Oscore: 0,
}
// MAIN ELEMENTS
const game = document.querySelector(".game")
const container = document.querySelector(".container")
const boxes = document.querySelectorAll(".container > div")

// SCOREBOARD
const leftScore = document.querySelector(".left-score p")
const rightScore = document.querySelector(".right-score p")
const XScore = document.querySelector(".x-score")
const OScore = document.querySelector(".o-score")

// MENU BUTTONS
const muteBtnImg = document.querySelector("#mute")
const restartBtnImg = document.querySelector("#restart")

// AUDIO ELEMENTS
const errorAudio = document.querySelector("#error-audio")
const OAudio = document.querySelector("#o-audio")
const XAudio = document.querySelector("#x-audio")
const endAudio = document.querySelector("#end-audio")
const drawAudio = document.querySelector("#draw-audio")
const audios = document.querySelectorAll("audio")

// CONFIG
let currSetTimeout
let muted = false
let defaultVolume = 0.2
audios.forEach((aud) => (aud.volume = defaultVolume))

function removeAllScoreGlowAniamationClass(time) {
  const animatedElements = document.querySelectorAll(".score-anim")

  setTimeout(() => {
    animatedElements.forEach((el) => el.classList.remove("score-anim"))
  }, time)
}

function addWinnerScore() {
  if (state.winner === "O") {
    state.Oscore += 1
    rightScore.textContent = state.Oscore
    OScore.textContent = state.Oscore

    //add glow animation when scoring
    document
      .querySelector(".aside-score.right-score")
      .classList.add("score-anim")
    document
      .querySelector(".score div:nth-child(3)")
      .classList.add("score-anim")
  }
  if (state.winner === "X") {
    state.Xscore += 1
    leftScore.textContent = state.Xscore
    XScore.textContent = state.Xscore

    //add glow animation when scoring
    document
      .querySelector(".aside-score.left-score")
      .classList.add("score-anim")
    document
      .querySelector(".score div:nth-child(1)")
      .classList.add("score-anim")
  }

  //remove animation class to be added again after someone score after "TIME" miliseconds
  const TIME = 750
  removeAllScoreGlowAniamationClass(TIME)
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

  if ((state.turn === "O" && !state.winner) || !state.totalBoxesChecked === 9) {
    BOTplay()
  }
}

function BOTplay() {
  setTimeout(() => {
    if (state.totalBoxesChecked < 1) return
    const allUnchekedBoxes = document.querySelectorAll('[checked=""]')
    if (!allUnchekedBoxes.length) return
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

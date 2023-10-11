const state = {
  turn: "X",
  totalBoxesChecked: 0,
  winner: "",
}
const game = document.querySelector(".game")
const container = document.querySelector(".container")
const boxes = document.querySelectorAll(".container > div")

const muteBtnImg = document.querySelector("#mute")

const errorAudio = document.querySelector("#error-audio")
const OAudio = document.querySelector("#o-audio")
const XAudio = document.querySelector("#x-audio")
const endAudio = document.querySelector("#end-audio")
const drawAudio = document.querySelector("#draw-audio")
const audios = document.querySelectorAll("audio")

let currSetTimeout
let muted = false

audios.forEach((aud) => (aud.volume = 0.2))

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

  // DRAW
  if (state.totalBoxesChecked === 9 && !state.winner) {
    playAudio(drawAudio)
    boxes.forEach((box) => box.classList.add("draw"))
    endGame()
  }
}

function mute() {
  if (muted) {
    muteBtnImg.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/1200px-Speaker_Icon.svg.png"
  } else {
    muteBtnImg.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mute_Icon.svg/1200px-Mute_Icon.svg.png"
  }

  muted = !muted
}

function endGame() {
  game.setAttribute("disabled", "")
}

function startGame() {
  boxes.forEach((box) => {
    box.classList.remove("winner")
    box.classList.remove("draw")
  })
  game.removeAttribute("disabled")
  container.style.opacity = "1"
  boxes.forEach((box) => box.setAttribute("checked", ""))
  state.turn = "X"
  state.winner = ""
  state.totalBoxesChecked = 0
}

// function restart() {
//   state.turn = "X"
//   state.totalBoxesChecked = 0

//   container.style.opacity = "0.5"
//   game.removeAttribute("disabled")
//   container.style.opacity = "1"
//   boxes.forEach((box) => box.setAttribute("checked", ""))
// }

function playAudio(audio) {
  if (muted) return
  audio.currentTime = 0
  audio.play()
}

function switchTurn() {
  state.turn = state.turn === "X" ? "O" : "X"
}

function checkBox(box) {
  // IF BOX IS ALREADY CHECKED
  if (box.getAttribute("checked")) {
    if (currSetTimeout) {
      clearTimeout(currSetTimeout)
    }
    playAudio(errorAudio)
    game.style.animation = "shake 0.1s infinite linear alternate"
    box.classList.add("draw")
    currSetTimeout = setTimeout(() => {
      game.style.animation = "none"
    }, 250)
    setTimeout(() => {
      box.classList.remove("draw")
    }, 250)
    return
  }
  box.setAttribute("checked", state.turn)
  state.totalBoxesChecked += 1

  state.turn === "X" ? playAudio(XAudio) : playAudio(OAudio)
  checkWinner()
  switchTurn()
}

boxes.forEach((box) =>
  box.addEventListener("click", () => {
    checkBox(box)
  })
)

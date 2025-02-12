const toolIcons = document.querySelectorAll(".tool-bar i")
const rightToolBar = document.querySelector(".tool-bar.right-bar")
const initialBoard = document.querySelector(".board")

let currentBoard = initialBoard
currentBoard.height = currentBoard.clientHeight //without explicitly setting these two to match CSS width (clientWidth) & CSS height (clientHeight), lines are drawn at default canvas 300 X 150 px size, appearing at weird postions on this big canvas
currentBoard.width = currentBoard.clientWidth

let ctx = currentBoard.getContext("2d")
let startX, startY
let isDrawing = false

///
ctx.strokeStyle = "red"
currentBoard.style.backgroundColor = "black"

toolIcons.forEach((icon, idx) => {
  icon.addEventListener("click", () => {
    removeActiveClassAll()

    rightToolBar.dataset.activeTool = icon.dataset.toolName
    icon.classList.add("active")
  })
})

function removeActiveClassAll() {
  toolIcons.forEach((elem) => {
    elem.classList.remove("active")
    rightToolBar.dataset.activeTool = "none"
  })

}


currentBoard.addEventListener("mousedown", (e) => {
  startX = e.offsetX
  startY = e.offsetY
  isDrawing = true
})

currentBoard.addEventListener("mouseup", () => {
  isDrawing = false
})

currentBoard.addEventListener("mousemove", handleMouseMove)

function handleMouseMove(mouseEvent) {
  if (!isDrawing) return

  switch (rightToolBar.dataset.activeTool) {
    case "line":
      drawLine(mouseEvent)
      break;

    case "circle":
      drawCircle(mouseEvent)
      break;

    case "rectangle":
      drawRectangle(mouseEvent)
      break;

  }

}

function drawLine(e) {
  ctx.clearRect(0, 0, currentBoard.width, currentBoard.height) //canvas elems have .height & .width, more accurate than .clientHeight & .clientWidth global props
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawCircle(e) {
  ctx.clearRect(0, 0, currentBoard.width, currentBoard.height)
  ctx.beginPath()
  const dx = Math.abs(e.offsetX - startX)
  const dy = Math.abs(e.offsetY - startY)
  ctx.ellipse(startX, startY, dx, dy, 0, 0, Math.PI * 2, false)
  ctx.stroke()
}

function drawRectangle(e) {
  ctx.clearRect(0, 0, currentBoard.width, currentBoard.height)
  ctx.beginPath()
  const dx = e.offsetX - startX
  const dy = e.offsetY - startY
  ctx.rect(startX, startY, dx, dy)
  ctx.stroke()
}
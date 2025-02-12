const toolIcons = document.querySelectorAll(".tool-bar i")
const rightToolBar = document.querySelector(".tool-bar.right-bar")
const initialBoard = document.querySelector(".board")

let currentBoard = initialBoard
currentBoard.height = currentBoard.clientHeight //without explicitly setting these two to match CSS width (clientWidth) & CSS height (clientHeight), lines are drawn at default canvas 300 X 150 px size, appearing at weird postions on this big canvas
currentBoard.width = currentBoard.clientWidth

let ctx = currentBoard.getContext("2d")
let startX, startY
let isDrawing = false

toolIcons.forEach((icon, idx) => {
  icon.addEventListener("click", () => {
    deactivateAll()

    rightToolBar.dataset.activeTool = icon.dataset.toolName
    icon.classList.add("active")
    handleToolChange()
  })
})

function deactivateAll() {
  toolIcons.forEach((elem) => {
    elem.classList.remove("active")
    rightToolBar.dataset.activeTool = "none"
  })

}

function handleToolChange() {
  switch (rightToolBar.dataset.activeTool) {
    case "line":
      triggerLineTool()
      break;

    case "circle":
      triggerCircleTool()
      break;

    case "rectangle":
      triggerRectangleTool()
      break;

  }
}

function triggerLineTool() {
  removeAllEventListeners()

  currentBoard.addEventListener("mousedown", (e) => {
    startX = e.offsetX
    startY = e.offsetY
    isDrawing = true
  })

  currentBoard.addEventListener("mousemove", (e) => {
    // console.log(isDrawing)
    if (!isDrawing) return;

    ctx.clearRect(0, 0, currentBoard.width, currentBoard.height) //canvas elems have .height & .width, more accurate than .clientHeight & .clientWidth global props

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineWidth = 2
    ctx.stroke()

  })

  currentBoard.addEventListener("mouseup", () => {
    isDrawing = false
  })
}

function triggerCircleTool() {

}

function triggerRectangleTool() {

}

function removeAllEventListeners() {
  const newBoard = currentBoard.cloneNode(true)
  currentBoard.parentNode.replaceChild(newBoard, currentBoard)
  currentBoard = newBoard

  currentBoard.height = currentBoard.clientHeight
  currentBoard.width = currentBoard.clientWidth
  ctx = currentBoard.getContext("2d") //reinitialize context to use context of the new board

}
const toolIcons = document.querySelectorAll(".tool-bar i")
const rightToolBar = document.querySelector(".tool-bar.right-bar")
const board = document.querySelector(".board")
const eraser = document.querySelector(".eraser")
const dialog = document.querySelector(".dialog")
const lineOptions = document.querySelector(".line-options")
const lineWidthInput = document.querySelector("#line-width")

board.height = board.clientHeight //without explicitly setting these two to match CSS width (clientWidth) & CSS height (clientHeight), lines are drawn at default canvas 300 X 150 px size, appearing at weird postions on this big canvas
board.width = board.clientWidth

let ctx = board.getContext("2d")
let startX, startY
let isDrawing = false //isDrawing is true when mousedown always, hence alternative name: "isMouseDown"
let snapshot
ctx.lineWidth = 1 //default

///
// ctx.strokeStyle = "red"
// board.style.backgroundColor = "black"

toolIcons.forEach((icon, idx) => {
  //for all icons
  icon.addEventListener("click", () => {
    resetTools()
    rightToolBar.dataset.activeTool = icon.dataset.toolName
    icon.classList.add("active")
  })

  //operations specific to an icon
  switch (icon.dataset.toolName) {
    case "line":
      icon.addEventListener("click", () => {
        dialog.style.display = "block"
        lineOptions.style.display = "block"
      })

      break

    case "eraser":
      icon.addEventListener("click", () => {
        eraser.style.display = "block"
      })

      break
  }

})


function resetTools() {
  //used to deavtivate all tools (remove classes), hide eraser box, dialog box etc when its tool not selected
  toolIcons.forEach((elem) => {
    elem.classList.remove("active")
    rightToolBar.dataset.activeTool = "none"
  })
  dialog.style.display = "none"
  lineOptions.style.display = "none"
  eraser.style.display = "none"
}


board.addEventListener("mousedown", (e) => {
  startX = e.offsetX
  startY = e.offsetY
  isDrawing = true
  snapshot = ctx.getImageData(0, 0, board.width, board.height)
})

board.addEventListener("mouseup", () => {
  isDrawing = false
})

board.addEventListener("mousemove", handleMouseMove)

lineWidthInput.addEventListener("change", (e) => {
  const val = parseInt(e.target.value)

  if (val >= 1 && val <= 5) ctx.lineWidth = val
})

function handleMouseMove(mouseEvent) {
  if (rightToolBar.dataset.activeTool === "eraser") {
    eraser.style.top = `${mouseEvent.clientY - 6}px`
    eraser.style.left = `${mouseEvent.clientX - 6}px`
  }

  if (!isDrawing) return

  ctx.clearRect(0, 0, board.width, board.height) //canvas elems have .height & .width, more accurate than .clientHeight & .clientWidth global props
  ctx.putImageData(snapshot, 0, 0) //to preserve previous drawing while drawing new
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

    case "eraser":
      erase(mouseEvent)
      break
  }

}

function drawLine(e) {
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.stroke()
}

function drawCircle(e) {
  ctx.beginPath()
  const dx = Math.abs(e.offsetX - startX)
  const dy = Math.abs(e.offsetY - startY)
  ctx.ellipse(startX, startY, dx, dy, 0, 0, Math.PI * 2, false)
  ctx.stroke()
}

function drawRectangle(e) {
  ctx.beginPath()
  const dx = e.offsetX - startX
  const dy = e.offsetY - startY
  ctx.rect(startX, startY, dx, dy)
  ctx.stroke()
}

function erase(e) {
  const eraserX = e.offsetX
  const eraserY = e.offsetY
  const eraserWidth = eraser.clientWidth
  const eraserHeight = eraser.clientHeight

  ctx.clearRect(eraserX - 6, eraserY - 6, eraserWidth, eraserHeight) // minus 6 to bring the cursor at center of box instead of top left corner
  snapshot = ctx.getImageData(0, 0, board.width, board.height)
}


const toolIcons = document.querySelectorAll(".tool-bar i")
const rightToolBar = document.querySelector(".tool-bar.right-bar")
const board = document.querySelector(".board")

const ctx = board.getContext("2d")

board.width = board.clientWidth
board.height = board.clientHeight
let startX, startY
let isDrawing = false

board.addEventListener("mousedown", (e) => {
  startX = e.offsetX
  startY = e.offsetY
  isDrawing = true
})

board.addEventListener("mousemove", (e) => {
  // console.log(isDrawing)
  if (!isDrawing) return;

  ctx.clearRect(0, 0, board.width, board.height)

  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.lineWidth = 2
  ctx.stroke()

})

board.addEventListener("mouseup", () => {
  isDrawing = false
})


//Tool selection
toolIcons.forEach((icon, idx, toolIcons) => {
  icon.addEventListener("click", () => {
    deactivateAll(toolIcons)

    rightToolBar.dataset.activeTool = icon.dataset.toolName
    icon.classList.add("active")
  })
})

function deactivateAll(nodeList) {
  nodeList.forEach((elem) => {
    elem.classList.remove("active")
  })

}
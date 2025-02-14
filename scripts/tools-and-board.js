const toolIcons = document.querySelectorAll(".tool-container i") //because save icon doesn't lie in .tool-bar
const rightToolBar = document.querySelector(".tool-bar.right-bar")
const board = document.querySelector(".board")
const eraser = document.querySelector(".eraser")
const dialog = document.querySelector(".dialog")
const lineOptions = document.querySelector(".line-options")
const lineWidthInput = document.querySelector("#line-width")
const lineDashRadioBtns = document.querySelectorAll(".line-dash input")
const imageLoader = document.querySelector("#file-input")
const colorInput = document.querySelector("#color-input")

board.height = board.clientHeight //without explicitly setting these two to match CSS width (clientWidth) & CSS height (clientHeight), lines are drawn at default canvas 300 X 150 px size, appearing at weird postions on this big canvas
board.width = board.clientWidth

const allDrawingsSet = new Set() //to store history / info about store all the drawn shapes
const ctx = board.getContext("2d")

//defaults
let startX = 0
let startY = 0
let width = 0 //default width without any tool selected or used yet
let height = 0
let fillImage = ""
let isDrawing = false //isDrawing is true when mousedown always, hence alternative name: "isMouseDown"
let snapshot
let color = "#ffffff";
ctx.lineWidth = 1 //default
ctx.setLineDash([]) //solid (no dash)
drawRectangle(0, 0, board.width, board.height, "fill", color) //initial white background
allDrawingsSet.add({ //record data of initial drawing as white background rectangle
  tool: "rectangle",
  type: "fill",
  color,
  startX,
  startY,
  width: board.width,
  height: board.height,
})
color = "#000000" //default for all drawings
ctx.fillStyle = color
ctx.strokeStyle = color
colorInput.value = color


///to use in dark mode
// ctx.strokeStyle = "red"
// ctx.fillStyle = "red"
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
        lineOptions.style.display = "flex"
      })

      break

    case "eraser":
      icon.addEventListener("click", () => {
        eraser.style.display = "block"
      })

      break

    case "fill":
      board.addEventListener("click", handleColorFill)

      break

    case "image":
      imageLoader.addEventListener("change", handleImageLoad)

      break

    case "save":
      icon.addEventListener("click", () => {
        const boardImageUrl = board.toDataURL("image/png")

        const downloadLink = document.createElement("a")
        downloadLink.href = boardImageUrl
        downloadLink.download = "graffiti-wall-drawing.png"

        downloadLink.click()
      })
      break

    case "color-picker":
      colorInput.addEventListener("change", (e) => { //though this code doesn't need a switch case, as it doesn't invlove its icon, but its input[type="color"]
        color = e.target.value
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
  fillImage = ""
}


board.addEventListener("mousedown", (e) => {
  startX = e.offsetX
  startY = e.offsetY
  isDrawing = true
  snapshot = ctx.getImageData(0, 0, board.width, board.height)
})

board.addEventListener("mouseup", () => {
  isDrawing = false

  if (
    rightToolBar.dataset.activeTool !== "fill" && //don't add new data when clicks occur for filling
    height > 2 && //prevent adding shapes too small, or shapes drawn as a mere click on the board
    width > 2
  ) {
    allDrawingsSet.add({
      tool: rightToolBar.dataset.activeTool,
      type: "stroke",
      startX,
      startY,
      width,
      height,
      color
    })

  }
  console.log(allDrawingsSet)

})

board.addEventListener("mousemove", handleMouseMove)

lineWidthInput.addEventListener("change", (e) => {
  const val = parseInt(e.target.value)

  if (val >= 1 && val <= 5) ctx.lineWidth = val
})

lineDashRadioBtns.forEach((radio) => {
  radio.addEventListener("click", () => {
    switch (radio.id) {
      case "solid":
        ctx.setLineDash([])
        break;
      case "1-to-1":
        ctx.setLineDash([5, 5])

        break;
      case "1-to-2-to-1":
        ctx.setLineDash([5, 10, 5])

        break;
    }

  })

})

function handleMouseMove(mouseEvent) {
  if (rightToolBar.dataset.activeTool === "eraser") {
    eraser.style.top = `${mouseEvent.clientY - 6}px`
    eraser.style.left = `${mouseEvent.clientX - 6}px`
  }

  if (!isDrawing) return

  ctx.clearRect(0, 0, board.width, board.height) //canvas elems have .height & .width, more accurate than .clientHeight & .clientWidth global props
  ctx.putImageData(snapshot, 0, 0) //to preserve previous drawing while drawing new

  width = Math.abs(mouseEvent.offsetX - startX)
  height = Math.abs(mouseEvent.offsetY - startY)

  switch (rightToolBar.dataset.activeTool) {
    case "line":
      drawLine(startX, startY, mouseEvent.offsetX, mouseEvent.offsetY, color)
      break;

    case "circle":
      drawCircle(startX, startY, width, height, "stroke", color)
      break;

    case "rectangle":
      drawRectangle(startX, startY, width, height, "stroke", color)
      break;

    case "eraser":
      erase(mouseEvent)
      break

    case "image":
      drawImageRectangle(startX, startY, width, height, fillImage)
      break
  }

}

//currently, fill only works for rectangles
function handleColorFill(e) {
  if (rightToolBar.dataset.activeTool !== "fill") return

  allDrawingsSet.forEach((drawing) => {
    const startX = drawing.startX
    const startY = drawing.startY
    const endX = parseInt(drawing.startX + drawing.width)
    const endY = parseInt(drawing.startY + drawing.height)

    //check if user clicked inside the reactangle before filling
    if (e.offsetX >= startX &&
      e.offsetX <= endX &&
      e.offsetY >= startY &&
      e.offsetY <= endY
    ) {
      drawing.type = "fill"
    }
  })

  //redraw all shapes, filling only the one inside which the user clicked
  ctx.clearRect(0, 0, board.width, board.height)
  allDrawingsSet.forEach((data) => {
    const { startX, startY, width, height, color } = data

    if (data.type === "fill") {
      drawRectangle(startX, startY, width, height, "fill", color)

    } else {
      drawRectangle(startX, startY, width, height, "stroke", color)
    }
  })

  //similarly like above (checking then drawing), also handle filling for ellipses...
  //similarly update the drawCircle() func
}

function handleImageLoad(e) {
  const imgFile = e.target.files[0]
  const fileReader = new FileReader()

  fileReader.onload = function (loadEvent) {
    const img = new Image()

    img.onload = function () {
      fillImage = img
    }

    img.src = loadEvent.target.result //not .value
  }

  if (imgFile) fileReader.readAsDataURL(imgFile)
}


//Utilities
function drawLine(startX, startY, endX, endY, color) {
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.strokeStyle = color
  ctx.stroke()
}

function drawCircle(startX, startY, width, height, type, color) {
  ctx.beginPath()
  ctx.ellipse(startX, startY, width, height, 0, 0, Math.PI * 2, false)

  if (type === "fill") {
    ctx.fillStyle = color
    ctx.fill()
  } else {
    ctx.strokeStyle = color
    ctx.stroke()
  }

}

function drawRectangle(startX, startY, width, height, type, color) {
  ctx.beginPath()
  ctx.rect(startX, startY, width, height)

  if (type === "fill") {
    ctx.fillStyle = color
    ctx.fill()
  } else {
    ctx.strokeStyle = color
    ctx.stroke()
  }

  //also modify code of other shapes to implement startX, startY, color... args instead of e (event)
}

function erase(e) {
  const eraserX = e.offsetX
  const eraserY = e.offsetY
  const eraserWidth = eraser.clientWidth
  const eraserHeight = eraser.clientHeight

  ctx.fillStyle = "#ffffff" //fill background color
  ctx.fillRect(eraserX - 6, eraserY - 6, eraserWidth, eraserHeight) // minus 6 to bring the cursor at center of box instead of top left corner
  snapshot = ctx.getImageData(0, 0, board.width, board.height)
}

function drawImageRectangle(startX, startY, width, height, img) {
  if (!img) return

  ctx.beginPath()
  ctx.drawImage(img, startX, startY, width, height)
}

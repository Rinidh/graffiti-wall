const toolIcons = document.querySelectorAll('.tool-bar i')
const rightToolBar = document.querySelector('.tool-bar.right-bar')


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

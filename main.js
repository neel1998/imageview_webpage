var mainListView = document.querySelector(".mainListView")
var mainPreview = document.querySelector(".mainPreview")
var curIdx = -1;

//display image in the preview div
const changeImage = (data) => {
  mainPreview.innerHTML = ""
  mainPreview.appendChild(createPreviewImage(data["previewImage"]))
  mainPreview.appendChild(createCaption(data["title"]))
}

//deactivate all the list items
const deActivateItems = () => {
  var listItems = document.querySelectorAll(".listitem")
  listItems.forEach((item) => {
    item.classList.remove("active")
  })
}

//create img element for the preview
const createPreviewImage = (url) => {
  let imgElement = document.createElement("img")
  imgElement.src = url
  return imgElement
}

//create caption element for the previewImage
const createCaption = (title) => {
  let captionElement = document.createElement("p")
  captionElement.innerHTML = title
  return captionElement
}

//call back when any item is selected
const itemSelected = (idx) => {
  curIdx = idx
  deActivateItems()
  changeImage(data[idx])
  mainListView.children[idx].classList.toggle("active")
}

//create list view items from the data
const createListItem = (data, idx) => {

  let title = data["title"]
  let imgURL = data["previewImage"]

  //main list div
  let listItem = document.createElement('div')
  listItem.classList.add("listitem")

  //thumbnail image
  let imgElement = document.createElement("img")
  imgElement.src = imgURL

  //image title
  let titleElement = document.createElement("p")
  titleElement.classList.add("listTitle")
  titleElement.innerHTML = title

  listItem.appendChild(imgElement)
  listItem.appendChild(titleElement)

  //click listener
  listItem.addEventListener("click", () => {
    itemSelected(idx)
  })
  return listItem
}

//add keyboard key listener to navigate in the listview
window.addEventListener("keydown", (event) => {
  const key = event.key
  if (key === "ArrowUp") {
    curIdx = (curIdx - 1 + data.length)%data.length
    itemSelected(curIdx)
  } else if (key === "ArrowDown") {
    curIdx = (curIdx + 1)%data.length
    itemSelected(curIdx)
  }
})

data.forEach( (item, idx) => {
    mainListView.appendChild(createListItem(item, idx))
})

//default selection
itemSelected(0)

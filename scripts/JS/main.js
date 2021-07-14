import data from "./data.js"


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
  captionElement.textContent = title
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
  titleElement.setAttribute("data", title)
  titleElement.textContent = title

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

const checkWidth = () => {
  document.querySelectorAll(".listTitle").forEach((item) => {
      /*const orig_caption = item.getAttribute("data")
      const orig_length = orig_caption.length
      item.textContent = orig_caption
      if (item.clientWidth < item.scrollWidth) {
        let possibleChars = Math.round((item.clientWidth*orig_length)/item.scrollWidth) // finding the posssible number of characters that can fit in given space

        possibleChars -= 3 // becasue we will be adding ... ellipsis characters
        let left = orig_caption.slice(0, Math.round(possibleChars/2))
        let right = orig_caption.slice(orig_length - Math.round(possibleChars/2))
        item.textContent = left + "..." + right
      }*/

      //binary search

      let min_length = 1
      let orig_caption = item.getAttribute("data")
      let max_length = orig_caption.length;
      item.textContent = orig_caption;

      if (item.scrollWidth > item.clientWidth) {
        var mid_length;
        var half_length;
        while (min_length < max_length) {
          mid_length = (max_length -  min_length)/2 + min_length;
          half_length = mid_length / 2
          item.textContent = orig_caption.substr(0, half_length) + "..." + orig_caption.substr(-half_length);
          if (item.scrollWidth > item.clientWidth) {
            max_length = mid_length - 1;
            item.textContent = orig_caption;
          } else {
            min_length = mid_length + 1;
            item.textContent = orig_caption;
          }
        }
        item.textContent = orig_caption.substr(0, mid_length / 2 - 1) + "..." + orig_caption.substr(-mid_length / 2);
      }
      
  });
}

//default selection
itemSelected(0)
checkWidth()
window.addEventListener("resize", checkWidth)

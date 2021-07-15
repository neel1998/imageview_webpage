import mainData from "./data.js"

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

const buildPage = (data) => {
  console.log(data)
  var mainListView = document.querySelector(".mainListView")
  var mainPreview = document.querySelector(".mainPreview")
  var curIdx = -1;

  mainPreview.innerHTML = ""
  mainListView.innerHTML = ""

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
  itemSelected(0)
  checkWidth()
}

const deActivatePaginationButtons = () => {
  document.querySelectorAll(".paginationButton").forEach((item) => {
    item.classList.remove("active")
  })
}

const paginationButtonSelected = (idx, maxItemsPerPage, sectionIdx, maxSectionsInPagination) => {
  deActivatePaginationButtons()
  document.querySelectorAll(".paginationButton")[idx - sectionIdx*maxSectionsInPagination].classList.add("active")
  buildPage(mainData.slice((idx)*maxItemsPerPage, (idx+1)*maxItemsPerPage))
} 

const createPaginationButton = (idx, maxItemsPerPage, sectionIdx, maxSectionsInPagination) => {
  let paginationButton = document.createElement('div');
  paginationButton.classList.add("paginationButton");
  paginationButton.textContent = idx+1;
  paginationButton.addEventListener("click", (event) => {
    paginationButtonSelected(idx, maxItemsPerPage, sectionIdx, maxSectionsInPagination)
  })
  return paginationButton
}

const addPagination = (sectionIdx, maxSectionsInPagination, maxItemsPerPage) => {
  var paginationContainer = document.querySelector(".paginationContainer")
  paginationContainer.innerHTML = ""
  for (let i = sectionIdx*maxSectionsInPagination; i < (sectionIdx+1)*maxSectionsInPagination && i < Math.ceil(mainData.length/ maxItemsPerPage); i ++) {
    paginationContainer.appendChild(createPaginationButton(i, maxItemsPerPage, sectionIdx, maxSectionsInPagination))
  }
}

const maxItemsPerPage = 4;
const maxSectionsInPagination = 3;
const dataLength = mainData.length;
const sections = Math.ceil(dataLength/ maxItemsPerPage)
const sectionGroups = Math.ceil(sections/ maxSectionsInPagination)
var sectionIdx = 0;


const sectionNextButton = document.querySelector("#section_button_next")
const sectionPrevButton = document.querySelector("#section_button_prev")

sectionNextButton.addEventListener("click", (event) => {
  sectionIdx ++;
  if (sectionIdx >= sectionGroups) {
    sectionIdx = sectionGroups - 1;
  }
  addPagination(sectionIdx, maxSectionsInPagination, maxItemsPerPage)
  paginationButtonSelected(sectionIdx*maxSectionsInPagination, maxItemsPerPage, sectionIdx, maxSectionsInPagination)  
})

sectionPrevButton.addEventListener("click", (event) => {
  sectionIdx --;
  if (sectionIdx < 0) {
    sectionIdx = 0;
  }
  addPagination(sectionIdx, maxSectionsInPagination, maxItemsPerPage)
  paginationButtonSelected(sectionIdx*maxSectionsInPagination, maxItemsPerPage, sectionIdx, maxSectionsInPagination)  
})

addPagination(sectionIdx, maxSectionsInPagination, maxItemsPerPage)
paginationButtonSelected(0, maxItemsPerPage, sectionIdx, maxSectionsInPagination)



window.addEventListener("resize", checkWidth)

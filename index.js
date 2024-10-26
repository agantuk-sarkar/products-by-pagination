// base url for showing all products
const baseUrl = "https://dummyjson.com/products";

// getting the html elements into js
const products_container = document.querySelector(".products-container");
const individual_buttons = document.querySelector(".individual-buttons");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

// taking variables for pageNo and total pages
let pageNo = 1;
let totalPages = null;

// taking temporary variable to change the status from readMore to show less
let temp = false;

// fetching the base url to get all products and using limit as a default parameter
const getProducts = async (pageNo, limit = 10) => {
  try {
    const skip = (pageNo - 1) * limit;
    const response = await fetch(`${baseUrl}?limit=${limit}&skip=${skip}`);

    if (response.ok) {
      const data = await response.json();

      // rounding off totalPages value to the nearest integer
      totalPages = Math.ceil(data.total / limit);

      console.log("data:", data);
      displayProducts(data.products);
      showIndividualButtons();
    } else {
      throw new Error("400 Bad Request");
    }
  } catch (error) {
    console.log("error:", error);
  }
};
getProducts(pageNo);

// click event for previous button
prev.addEventListener("click", () => {
  pageNo--;
  // console.log("pageNo:",pageNo);
  if (pageNo >= 1) {
    getProducts(pageNo);
  } else {
    prev.disabled = "true";
  }
});

// click event for next button
next.addEventListener("click", () => {
  pageNo++;
  // console.log("pageNo:",pageNo);
  // console.log("totalPages:",totalPages);
  if (pageNo <= totalPages) {
    getProducts(pageNo);
  } else {
    next.disabled = "true";
  }
});

// function to display products in UI
const displayProducts = (products) => {
  products_container.innerHTML = "";

  products?.forEach((product) => {
    const productMainDiv = document.createElement("div");
    productMainDiv.classList.add("product-mainDiv");

    const imageDiv = document.createElement("div");
    imageDiv.classList.add("imageDiv");

    const imageTag = document.createElement("img");
    imageTag.classList.add("imageTag");
    imageTag.src = product.thumbnail;

    const textDiv = document.createElement("div");
    textDiv.classList.add("textDiv");

    const price = document.createElement("h3");
    price.textContent = product.price;

    const title = document.createElement("p");
    title.textContent = product.title;

    const description = document.createElement("p");
    description.textContent = product.description;
    description.classList.add("description");

    const readMoreButton = document.createElement("button");
    readMoreButton.textContent = "Read More";
    readMoreButton.classList.add("read-more-button");

    // function to show less text which is called inside readMoreButton event
    function showLess(temp) {
      if (temp) {
        const showLessButton = document.createElement("button");
        showLessButton.textContent = "Show Less";
        showLessButton.classList.add("show-less-text");
        textDiv.append(showLessButton);

        // click event for showLessButton
        showLessButton.addEventListener("click", () => {
          showLessButton.style.display = "none";
          description.classList.add("when-clicked-showLess-button");
          description.classList.remove("when-clicked-readMore-button");
          description.style.overflow = "hidden";

          readMoreButton.style.display = "block";
          textDiv.append(readMoreButton);
        });
      }
      // console.log(temp);
    }

    // click event for readMoreButton
    readMoreButton.addEventListener("click", () => {
      temp = true;

      description.style.overflow = "visible";
      readMoreButton.style.display = "none";

      description.classList.add("when-clicked-readMore-button");
      description.classList.remove("when-clicked-showLess-button");

      showLess(temp);

    });

    imageDiv.append(imageTag);
    textDiv.append(price, title, description, readMoreButton);

    productMainDiv.append(imageDiv, textDiv);

    products_container.append(productMainDiv);
  });
};

// function to show individual buttons for individual pages
const showIndividualButtons = () => {
  // this will clear the button container everytime the function is called
  individual_buttons.innerHTML = "";

  // taking startPage and endPage to show only 5 buttons at once
  let startPage = null;
  let endPage = null;

  // checking the pages if valid then it will show only 5 buttons and it won't exceed totalPages
  if (pageNo < 3) {
    startPage = 1;
    endPage = 5;
  } else if (pageNo + 2 >= totalPages) {
    startPage = totalPages - 4;
    endPage = totalPages;
  } else {
    startPage = pageNo - 2;
    endPage = pageNo + 2;
  }
  console.log("startPage:", startPage);
  console.log("endPage:", endPage);

  // showing minimum pages before the loop executes
  if (pageNo > 3) {
    const span = document.createElement("span");
    span.textContent = "...";
    span.classList.add("dots");

    const firstButton = document.createElement("button");
    firstButton.textContent = "1";
    firstButton.classList.add("pageButtons");

    firstButton.addEventListener("click", () => {
      pageNo = 1;
      getProducts(pageNo);
    });

    individual_buttons.append(firstButton, span);

    if (pageNo === 1) {
      individual_buttons.removeChild(firstButton);
      individual_buttons.removeChild(span);
    }
  }

  // applying for loop to get the no of button between startPage and endPage
  for (let i = startPage; i <= endPage; i++) {
    const buttons = document.createElement("button");
    buttons.textContent = i;
    buttons.classList.add("pageButtons");

    // showing the selected button in background color
    if (i === pageNo) {
      buttons.classList.add("change-color");
    }

    // click event for buttons
    buttons.addEventListener("click", () => {
      // re-assigning the pageNo with the selected button
      pageNo = i;

      // calling the getPorducts function to send the selected pageNo
      getProducts(pageNo);
    });

    individual_buttons.append(buttons);
  }

  // showing the maximum pages after the loop executes
  if (pageNo > 3) {
    const spanTagForDots = document.createElement("span");
    spanTagForDots.textContent = "...";
    spanTagForDots.classList.add("dots");
    // individual_buttons.appendChild(spanTagForDots);

    const extraButton = document.createElement("button");
    extraButton.textContent = totalPages;
    extraButton.classList.add("pageButtons");

    // if the last page is clicked then it should show the last page products
    extraButton.addEventListener("click", () => {
      pageNo = totalPages;
      getProducts(pageNo);
    });

    individual_buttons.append(spanTagForDots, extraButton);

    // if the totalPages and the last pageNo matches then remove the last button text and also the dots which is in span tag

    if (pageNo === totalPages) {
      individual_buttons.removeChild(extraButton);
      individual_buttons.removeChild(spanTagForDots);
    }
    // individual_buttons.appendChild(extraButton);
  }
};

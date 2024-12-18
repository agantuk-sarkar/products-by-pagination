// base url for showing all products
const baseUrl = "https://dummyjson.com/products";

// category list url
const categoryUrl = "https://dummyjson.com/products/category-list";

// getting the html elements into js
const show_products = document.querySelector(".show-products");
const sorting_container = document.querySelector(
  ".sort-by-categories-container"
);
const sort_by = document.getElementById("sort-by");
const select_category = document.getElementById("categories-select-dropdown");
const individual_buttons = document.querySelector(".individual-buttons");
const search_input = document.getElementById("search");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

// taking variables for pageNo and total pages
let pageNo = 1;
let totalPages = null;

// taking temporary variable to change the status from readMore to show less
let temp = false;

// timeout ID
let timeOutId = null;

let searchValue = null;

// event for search input with debouncing
search_input.addEventListener("input", () => {
  
  searchValue = search_input.value;

  debounce(getProducts, 2000, searchValue);
});

// function for debouncing
const debounce = (functionToCall, timer, searchValue) => {
  if (timeOutId) {
    clearTimeout(timeOutId);
  }

  timeOutId = setTimeout(() => {

    pageNo = 1;

    functionToCall(pageNo, 10, searchValue);

    // this will reset the state of prev and next button
    next.disabled = false;
    prev.disabled = false;
  }, timer);
};

// fetching the base url to get all products and using limit as a default parameter
const getProducts = async (
  pageNo,
  limit = 10,
  searchValue = "",
  sortByValue = "",
  sortByOrder = "",
  categories = ""
) => {
  try {
    let url = null;
    const skip = (pageNo - 1) * limit;

    if (searchValue) {
      console.log("searchValue:", searchValue);
      url = `${baseUrl}/search?q=${searchValue}&limit=${limit}&skip=${skip}`;
    } else if (sortByValue) {
      url = `${baseUrl}?limit=${limit}&skip=${skip}&sortBy=${sortByValue}&order=${sortByOrder}`;
    } else if (categories != "") {
      url = `${baseUrl}/category/${categories}?limit=${limit}&skip=${skip}`;
    } else {
      url = `${baseUrl}?limit=${limit}&skip=${skip}`;
    }

    const response = await fetch(`${url}`);

    if (response.ok) {
      const data = await response.json();

      // rounding off totalPages value to the nearest integer
      totalPages = Math.ceil(data.total / limit);

      console.log("data:", data);
      displayProducts(data.products);

      handlePagination(totalPages, data.total);
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

  if (
    sort_by.value &&
    !searchValue &&
    sort_by.value != "Sort By: Price/Rating"
  ) {
 
    if (sort_by.value === "titleAtoZ") {
      getProducts(pageNo, 10, "", "title", "asc");
    } else if (sort_by.value === "titleZtoA") {
      getProducts(pageNo, 10, "", "title", "desc");
    } else if (sort_by.value === "priceLow") {
      getProducts(pageNo, 10, "", "price", "asc");
    } else if (sort_by.value === "priceHigh") {
      getProducts(pageNo, 10, "", "price", "desc");
    } else if (sort_by.value === "ratingLow") {
      getProducts(pageNo, 10, "", "rating", "asc");
    } else if (sort_by.value === "ratingHigh") {
      getProducts(pageNo, 10, "", "rating", "desc");
    }
  } else {
    if (select_category.value && select_category.value != "All Categories") {
      getProducts(pageNo, 10, "", "", "", select_category.value);
      if (pageNo === 1) {
        prev.disabled = true;
        next.disabled = false;
      }
    } else {
      if (totalPages >= 1 && pageNo >= 1) {
        getProducts(pageNo, 10, searchValue);
      } else if (pageNo >= 1) {
        getProducts(pageNo);
      } else {
        prev.disabled = true;
        next.disabled = false;
        pageNo++;
      }
    }
  }
});

// click event for next button
next.addEventListener("click", () => {
  pageNo++;

  if (select_category.value && select_category.value != "All Categories") {
    getProducts(pageNo, 10, "", "", "", select_category.value);
    console.log(select_category.value);

    if (pageNo === totalPages) {
      next.disabled = true;
      prev.disabled = false;
    }
  } else if (totalPages <= 3 && pageNo <= 3) {
    getProducts(pageNo, 10, searchValue);
  } else if (sort_by.value === "titleAtoZ") {
    getProducts(pageNo, 10, "", "title", "asc");
  } else if (sort_by.value === "titleZtoA") {
    getProducts(pageNo, 10, "", "title", "desc");
  } else if (sort_by.value === "priceLow") {
    getProducts(pageNo, 10, "", "price", "asc");
  } else if (sort_by.value === "priceHigh") {
    getProducts(pageNo, 10, "", "price", "desc");
  } else if (sort_by.value === "ratingLow") {
    getProducts(pageNo, 10, "", "rating", "asc");
  } else if (sort_by.value === "ratingHigh") {
    getProducts(pageNo, 10, "", "rating", "desc");
  } else if (pageNo <= totalPages) {
    getProducts(pageNo);
  } else {
    next.disabled = true;
    prev.disabled = false;
    pageNo--;
  }

});

// function to display products in UI
const displayProducts = (products) => {
  show_products.innerHTML = "";

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
    price.textContent = `Rs ${product.price}`;
    price.classList.add("price");

    const title = document.createElement("p");
    title.textContent = product.title;
    title.classList.add("title");

    const ratingContainer = document.createElement("div");
    ratingContainer.classList.add("rating-container");

    // taking variables for full star and decimal star rating
    let fullStar = Math.floor(product.rating);
    let decimalStar = +(product.rating - fullStar).toString().slice(0, 4);

    // using for loop to create 5 stars for rating
    for (let i = 1; i <= 5; i++) {
      const stars = document.createElement("span");
      stars.innerHTML = "&#9733";
      stars.classList.add("individual-star");

      if (i <= fullStar) {
        stars.classList.add("full-stars");
      } else if (i === fullStar + 1 && decimalStar > 0) {
        stars.classList.add("decimal-star");

        let decimalPercentage = decimalStar * 100;

        stars.style.setProperty("--fill-percent", `${decimalPercentage}%`);
      }

      ratingContainer.append(stars);
    }

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
    textDiv.append(title, price, ratingContainer, description, readMoreButton);

    productMainDiv.append(imageDiv, textDiv);

    show_products.append(productMainDiv);
  });
};

// function to handle pagination
const handlePagination = (totalPages, totalLimit) => {
  console.log("totalPages:", totalPages);
  console.log("totalLimit:", totalLimit);

  // this will clear the button container everytime the function is called
  individual_buttons.innerHTML = "";

  // taking startPage and endPage to show only 5 buttons at once
  let startPage = null;
  let endPage = null;

  if (totalPages <= 3) {
    startPage = 1;
    endPage = totalPages;
  } else {
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
  }

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

      if (totalPages <= 3) {
        getProducts(pageNo, 10, searchValue);
      } else if (sort_by.value === "titleAtoZ") {
        getProducts(pageNo, 10, "", "title", "asc");
      } else if (sort_by.value === "titleZtoA") {
        getProducts(pageNo, 10, "", "title", "desc");
      } else if (sort_by.value === "priceLow") {
        getProducts(pageNo, 10, "", "price", "asc");
      } else if (sort_by.value === "priceHigh") {
        getProducts(pageNo, 10, "", "price", "desc");
      } else if (sort_by.value === "ratingLow") {
        getProducts(pageNo, 10, "", "rating", "asc");
      } else if (sort_by.value === "ratingHigh") {
        getProducts(pageNo, 10, "", "rating", "desc");
      } else {
        getProducts(pageNo);
      }
    });

    individual_buttons.append(buttons);
  }

  // showing the maximum pages after the loop executes
  if (pageNo > 3) {
    const spanTagForDots = document.createElement("span");
    spanTagForDots.textContent = "...";
    spanTagForDots.classList.add("dots");

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
  }
};

// adding change event on sorting
sort_by.addEventListener("change", handleSorting);

// function to handle sorting
function handleSorting() {
  // console.log(event.target.value);
  console.log(sort_by.value);

  if (sort_by.value === "titleAtoZ") {
    getProducts(pageNo, 10, "", "title", "asc");
  } else if (sort_by.value === "titleZtoA") {
    getProducts(pageNo, 10, "", "title", "desc");
  } else if (sort_by.value === "priceLow") {
    getProducts(pageNo, 10, "", "price", "asc");
  } else if (sort_by.value === "priceHigh") {
    getProducts(pageNo, 10, "", "price", "desc");
  } else if (sort_by.value === "ratingLow") {
    getProducts(pageNo, 10, "", "rating", "asc");
  } else if (sort_by.value === "ratingHigh") {
    getProducts(pageNo, 10, "", "rating", "desc");
  }
}

// function to fetch the category list api
const fetchCategories = async () => {
  try {
    const response = await fetch(categoryUrl);

    if (response.ok) {
      const data = await response.json();
      console.log("categoryData:", data);
      getCategoryDropDown(data);
    } else {
      throw new Error("Invalid Url");
    }
  } catch (error) {
    console.log("error:", error);
  }
};

// function to get the dropdown for category list
const getCategoryDropDown = (categories) => {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;

    select_category.append(option);
  });
};

fetchCategories();

// adding change event for category
select_category.addEventListener("change", () => {
  pageNo = 1;
  getProducts(pageNo, 10, "", "", "", select_category.value);
});

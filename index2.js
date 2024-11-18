// base url
const baseUrl = "https://dummyjson.com/products";

// getting html elements into js
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

// variables for pageNo and totalPages
let pageNo = 1;
let totalPages = null;

// fetching the base url and taking limit as a default parameter
const getProducts = async (pageNo, limit = 10) => {
  try {
    const skip = (pageNo - 1) * limit;
    const response = await fetch(`${baseUrl}?limit=${limit}&skip=${skip}`);

    if (response.ok) {
      const data = await response.json();
      // rounding off totalPages value to the nearest integer
      totalPages = Math.ceil(data.total / limit);
      console.log("data:", data);
    } else {
      throw new Error("400 Bad request");
    }
  } catch (error) {
    console.log("error:", error);
  }
};

getProducts(pageNo);

// click event for previous button
prev.addEventListener("click", () => {
  pageNo--;

  if(pageNo >= 1){
    // console.log("pageNo:",pageNo);
    getProducts(pageNo);
  } else {
    prev.disabled = "true";
  }

});

// click event for next button
next.addEventListener("click", () => {
  pageNo++;

  if (pageNo <= totalPages) {
    // console.log("pageNo:", pageNo);
    getProducts(pageNo);
  } else {
    next.disabled = "true";
  }
});

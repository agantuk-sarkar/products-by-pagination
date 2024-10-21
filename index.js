// base url for showing all products
const baseUrl = "https://dummyjson.com/products";

// getting the html elements into js
const products_container = document.querySelector(".products-container");
const prev = document.querySelector(".prev");
const next  = document.querySelector(".next");

// taking variables for pageNo and total pages
let pageNo = 1;
let totalPages = null;

// fetching the base url to get all products and using limit as a default parameter
const getProducts = async (pageNo,limit=10)=>{
    try{
        const skip = (pageNo-1)*limit;
        const response = await fetch(`${baseUrl}?limit=${limit}&skip=${skip}`);

        if(response.ok){
            const data = await response.json();

            // rounding off totalPages value to the nearest integer            
            totalPages = Math.ceil(data.total/limit);

            console.log("data:",data);
            displayProducts(data.products);
        } else{
            throw new Error("400 Bad Request");
        }
    } catch(error){
        console.log("error:",error);
    }
}
getProducts(pageNo);

// click event for previous button
prev.addEventListener("click",()=>{
    pageNo--;
    // console.log("pageNo:",pageNo);
    if(pageNo >= 1){
        getProducts(pageNo);
    } else {
        prev.disabled = "true";
    }
});

// click event for next button
next.addEventListener("click",()=>{
    pageNo++;
    // console.log("pageNo:",pageNo);
    // console.log("totalPages:",totalPages);
    if(pageNo <= totalPages){
        getProducts(pageNo);
    } else {
        next.disabled = "true";
    }
});

// function to display products in UI
const displayProducts = (products)=>{

    products_container.innerHTML = "";

    products?.forEach((product)=>{
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

        imageDiv.append(imageTag);
        textDiv.append(price,title);

        productMainDiv.append(imageDiv,textDiv);

        products_container.append(productMainDiv);

    });
}

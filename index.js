// base url for showing all products
const baseUrl = "https://dummyjson.com/products";

// getting the html elements into js
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

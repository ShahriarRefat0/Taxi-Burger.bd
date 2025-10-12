const loadData = () => {
  const url = "https://taxi-kitchen-api.vercel.app/api/v1/categories";

  fetch(url)
    .then((res) => res.json())
    .then((data) => displayCategory(data.categories));
};

let cart = [];
let total = 0;

const spinnerManage = (value) => {
  if (value === true) {
    document.getElementById("food-container").classList.add("hidden");
    document.getElementById("loading-spinner").classList.remove("hidden");
  } else {
    document.getElementById("loading-spinner").classList.add("hidden");
    document.getElementById("food-container").classList.remove("hidden");
  }
};

const loadFoods = (id) => {
  spinnerManage(true);

  const url = `https://taxi-kitchen-api.vercel.app/api/v1/categories/${id}`;

  const catBtns = document.querySelectorAll(".btn-category");
  catBtns.forEach((btn) => btn.classList.remove("active"));

  const currentBtn = document.getElementById(`cat-btn-${id}`);
  currentBtn.classList.add("active");

  fetch(url)
    .then((res) => res.json())
    .then((data) => displayFoods(data.foods));
};

const loadRandomData = () => {
  const url = `https://taxi-kitchen-api.vercel.app/api/v1/foods/random`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayFoods(data.foods));
};

const loadFoodDetails = (id) => {
  const url = ` https://taxi-kitchen-api.vercel.app/api/v1/foods/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayDetails(data.details));
};

const displayCategory = (categories) => {
  const catContainer = document.getElementById("category-container");
  catContainer.innerHTML = " ";

  for (const cat of categories) {
    const categoryCard = document.createElement("div");
    categoryCard.innerHTML = `
    <button id="cat-btn-${cat.id}" onclick="loadFoods(${cat.id})" class="btn justify-start btn-block shadow btn-category">
          <img src="${cat.categoryImg}" alt="" class="w-10" />${cat.categoryName}
        </button>
    `;

    catContainer.append(categoryCard);
  }
};

const displayFoods = (foods) => {
  const foodContainer = document.getElementById("food-container");
  foodContainer.innerHTML = "";

  foods.forEach((food) => {
    const foodCard = document.createElement("div");
    foodCard.innerHTML = `
     <div  class="p-5 bg-white flex gap-3 shadow rounded-xl cursor-pointer">
          <div class="img flex-1 onclick="loadFoodDetails(${food.id})"">
            <img src="${food.foodImg}" alt=""
              class="w-[160px] rounded-xl h-[160px] object-cover food-img" />
          </div>
          <div class="flex-2">
            <h1 class="text-xl font-bold food-title">
              ${food.title}
            </h1>

            <div class="badge badge-warning">${food.category}</div>

            <div class="divider divider-end">
              <h2 class="text-yellow-600 font-semibold">
                $ <span class="price food-price">${food.price}</span> BDT
              </h2>
            </div>

            <button id="add-btn-${food.id}" onclick="addToCart(this)" class="btn btn-warning">
                <i class="fa-solid fa-square-plus"></i>
                Add This Item
              </button>
          </div>
        </div>
    `;

    foodContainer.append(foodCard);
     document
       .getElementById(`add-btn-${food.id}`)
       .addEventListener("click", (e) => {
         e.stopPropagation();
       });
  });
  spinnerManage(false);
};

const displayDetails = (food) => {
  
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
        
  <h2 class="text-3xl font-bold text-center " id="foodTitle">${food.title}</h2>
      <img
        id="foodImg"
        src=${food.foodImg}
        alt="Food Image"
        class="rounded-xl w-full h-64 object-cover"
      />

      <div class="flex justify-between items-center mt-3">
        <div class="badge badge-primary" id="foodArea">${food.area}</div>
        <div class="badge badge-secondary" id="foodCategory">${food.category}</div>
      </div>

      <p class="text-lg font-semibold ">Price: <span id="foodPrice">${food.price}৳</span></p>

      <div class="flex justify-end">
        <a
          id="foodVideo"
          href=${food.video}
          target="_blank"
          class="btn btn-warning"
        >
          Watch Video
        </a>
      </div>
  `;
  document.getElementById("my_modal_5").showModal();
};

loadData();
loadRandomData();


const addToCart = (btn) => {
  const card = btn.parentNode.parentNode;
  const foodTitle = card.querySelector(".food-title").innerText;

  const foodImg = card.querySelector(".food-img").src;

  const foodPrice = card.querySelector(".food-price").innerText;

  const foodPriceNum = Number(foodPrice);
  
const isExist = cart.find((item) => item.foodTitle == foodTitle)
  if (isExist) {
     for (let i = 0; i < cart.length; i++) {
       if (cart[i].foodTitle == foodTitle) {
         cart[i].quantity++;
         break;
       }
     }
} else {

  const selectedItem = {
   id: cart.length + 1,
    foodPrice: foodPrice,
    foodImg: foodImg,
    foodTitle: foodTitle,
    foodPriceNum: foodPriceNum
    }
    cart.push(selectedItem)
  }
  total = total + foodPriceNum

  displayCart(cart)
  displayTotal(total);
}

const displayTotal = (val) => {
  document.getElementById("cart-total").innerHTML = val;
};


const displayCart = (cart) => {
  console.log(cart)
  const cartContainer = document.getElementById("cart-container")
  cartContainer.innerText = "";
  for (let item of cart) {
    
    const newItem = document.createElement("div");
    newItem.innerHTML = `
    <div class="p-1 bg-white flex gap-3 shadow rounded-xl relative">
            <div class="img">
              <span class="hidden cart-id">${item.id}</span>
              <img
                src="${item.foodImg}"
                alt=""
                class="w-[50px] rounded-xl h-[50px] object-cover"
              />
            </div>
            <div class="flex-1">
              <h1  class="text-xs font-bold food-title">
                ${item.foodTitle}
              </h1>

              <div class="">
                <h2 class="text-yellow-600 font-semibold">
                 ${item.quantity} x $ <span class="item-price">${item.foodPrice}</span> BDT
                </h2>
                
              </div>
            </div>
            <div onclick="removeCart(this)"
              class="w-6 h-6 flex justify-center items-center bg-red-600 rounded-full absolute -top-1 -right-1 text-white cursor-pointer"
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>
    `;

    document.getElementById('cart-container').appendChild(newItem)
  }
}





const removeCart = (btn) => {
  const item = btn.parentNode;

  const id = Number(item.querySelector(".cart-id").innerText);

  const foodPrice = Number(item.querySelector(".item-price").innerText);

  cart = cart.filter((item) => item.id != id);

  total = 0;
  cart.forEach((item) => (total += item.foodPrice));

  displayCart(cart);
  displayTotal(total);
};
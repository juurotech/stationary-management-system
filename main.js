"use strict";

/* STORAGE */

let items = JSON.parse(localStorage.getItem("items")) || [];

/* ELEMENTS */

const loginBox = document.getElementById("loginBox");
const app = document.getElementById("app");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const addBtn = document.getElementById("addBtn");

const searchInput = document.getElementById("searchInput");

const clearBtn = document.getElementById("clearBtn");

const themeBtn = document.getElementById("themeBtn");

const tableBody = document.getElementById("tableBody");

/* LOGIN */

loginBtn.addEventListener("click", login);

function login(){

  const username = document.getElementById("username").value.trim();

  const password = document.getElementById("password").value.trim();

  if(username === "admin" && password === "1234"){

    loginBox.classList.add("hidden");

    app.classList.remove("hidden");

  }else{

    alert("Invalid Login");

  }

}

/* LOGOUT */

logoutBtn.addEventListener("click", logout);

function logout(){

  app.classList.add("hidden");

  loginBox.classList.remove("hidden");

}

/* ADD ITEM */

addBtn.addEventListener("click", addItem);

function addItem(){

  const name = sanitize(
    document.getElementById("name").value.trim()
  );

  const qty = Number(
    document.getElementById("qty").value
  );

  const category = sanitize(
    document.getElementById("category").value.trim()
  );

  const price = Number(
    document.getElementById("price").value
  );

  const discount = Number(
    document.getElementById("discount").value
  ) || 0;

  if(!name || !qty || !category || !price){

    alert("Please fill all fields");

    return;

  }

  if(qty <= 0 || price <= 0){

    alert("Invalid values");

    return;

  }

  const item = {
    id:Date.now(),
    name,
    qty,
    category,
    price,
    discount
  };

  items.push(item);

  saveItems();

  renderItems();

  clearForm();

}

/* RENDER */

function renderItems(){

  tableBody.innerHTML = "";

  let totalValue = 0;

  let totalDiscount = 0;

  items.forEach(item => {

    const finalPrice =
      item.price - (item.price * item.discount / 100);

    const total =
      finalPrice * item.qty;

    totalValue += total;

    totalDiscount +=
      (item.price - finalPrice) * item.qty;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.qty}</td>
      <td>$${item.price}</td>
      <td>${item.discount}%</td>
      <td>$${total.toFixed(2)}</td>
      <td>
        <button class="delete-btn" data-id="${item.id}">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(tr);

  });

  document.getElementById("totalItems").textContent =
    items.length;

  document.getElementById("totalValue").textContent =
    `$${totalValue.toFixed(2)}`;

  document.getElementById("totalDiscount").textContent =
    `$${totalDiscount.toFixed(2)}`;

  document.getElementById("rItems").textContent =
    items.length;

  document.getElementById("rValue").textContent =
    `$${totalValue.toFixed(2)}`;

}

/* DELETE */

tableBody.addEventListener("click", function(e){

  if(e.target.classList.contains("delete-btn")){

    const id = Number(e.target.dataset.id);

    deleteItem(id);

  }

});

function deleteItem(id){

  items = items.filter(item => item.id !== id);

  saveItems();

  renderItems();

}

/* SEARCH */

searchInput.addEventListener("input", liveSearch);

function liveSearch(){

  const value =
    searchInput.value.toLowerCase();

  const rows =
    document.querySelectorAll("#tableBody tr");

  rows.forEach(row => {

    row.style.display =
      row.innerText.toLowerCase().includes(value)
      ? ""
      : "none";

  });

}

/* SETTINGS */

clearBtn.addEventListener("click", clearAll);

function clearAll(){

  const confirmDelete =
    confirm("Delete all data?");

  if(confirmDelete){

    items = [];

    saveItems();

    renderItems();

  }

}

/* DARK MODE */

themeBtn.addEventListener("click", toggleDarkMode);

function toggleDarkMode(){

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark")
      ? "dark"
      : "light"
  );

}

function loadTheme(){

  const theme =
    localStorage.getItem("theme");

  if(theme === "dark"){

    document.body.classList.add("dark");

  }

}

/* NAVIGATION */

const menuItems =
  document.querySelectorAll(".sidebar li[data-page]");

menuItems.forEach(item => {

  item.addEventListener("click", () => {

    showPage(item.dataset.page);

  });

});

function showPage(pageId){

  document.querySelectorAll(".page")
    .forEach(page => {

      page.classList.add("hidden");

    });

  document.getElementById(pageId)
    .classList.remove("hidden");

}

/* HELPERS */

function saveItems(){

  localStorage.setItem(
    "items",
    JSON.stringify(items)
  );

}

function clearForm(){

  document.getElementById("name").value = "";

  document.getElementById("qty").value = "";

  document.getElementById("category").value = "";

  document.getElementById("price").value = "";

  document.getElementById("discount").value = "";

}

function sanitize(text){

  return text.replace(/[<>]/g,"");

}

/* INIT */

loadTheme();

renderItems();
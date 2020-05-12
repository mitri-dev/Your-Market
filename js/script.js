/*
// INDEX
1. Sticky Nav (Debounce and Slide In)
2. Smooth Scroll (Smooth Scroll, ease)
3. Slider (Smooth Slider Scroll, ease, sliderArrows, SliderDots)
4. GoogleSheet Form Post (sendForm)
5. Mobile Nav
6. Burgers
*/
// Global Variables
let products;
let categories;

  // Getting the products - Populates Array of Products
  async function getProducts() {
    if(sessionStorage.getItem('productsBPS')) {
      products = JSON.parse(sessionStorage.getItem('productsBPS'));

      categories = products
        .map(product => product.category)
        .reduce((obj, e) => {
          if(!obj[e]){
            obj[e] = 0;
          }
          obj[e]++;
          return obj;
        }, {});
      categories.todos = products.length;

    } else {
      const res = await fetch('./js/products.json');
      const data = await res.json();
      
      products = data.items.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        const link = '#item-link';
        const { amount } = item.fields;
        const { category } = item.fields;
        return { title, price, id, image, link, amount, category };
      });

      categories = products
        .map(product => product.category)
        .reduce((obj, e) => {
          if(!obj[e]){
            obj[e] = 0;
          }
          obj[e]++;
          return obj;
        }, {});
      categories.todos = products.length;


      sessionStorage.setItem('productsBPS', JSON.stringify(products));
    }
  }



// Elements
const nav = document.querySelector('nav');
const navMobile = document.querySelector('nav.mobile');
const brandBanner = document.querySelector('.brand-banner');
const navLinks = nav.querySelectorAll('a');
const burger = document.querySelector('.burger')
const burgerMenu = document.querySelector('.burger-menu')
const navMobileLinks = burgerMenu.querySelectorAll('a');

// Listeners
window.addEventListener('scroll', debounce(slideIn, 5));
navLinks.forEach(link =>
  link.addEventListener('click', () => {
    smoothScroll(document.querySelector(`.${link.id}`));
  })
);
navMobileLinks.forEach(link =>
  link.addEventListener('click', () => {
    smoothScroll(document.querySelector(`.${link.id}`));
  })
);
burger.addEventListener('click', showMenu)



// Debouncer
function debounce(func, wait, immediate = true) {
  let timeout;
  return function() {
    const context = this;

    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function slideIn() {
  const offset = 0;
  const topPoint = window.scrollY > brandBanner.offsetHeight + nav.offsetHeight + offset;
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  if (topPoint) {
    main.classList.add('fixed');
    header.classList.add('fixed');
    setTimeout(() => {
      header.classList.add('fixed-100');
    }, 10);
  } else {
    if (window.scrollY === 0) return;
    if (window.scrollY > 5) return;
    header.classList.remove('fixed-100');
    header.classList.remove('fixed');
    main.classList.remove('fixed');
  }
}

function ease(t, b, c, d) {
	t /= d;
	return -c * t*(t-2) + b;
};

function smoothScroll(target, duration = 350) {
  const targetPosition = target.getBoundingClientRect().top;
  const startPosition = window.pageYOffset;
  const offset = 190;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, targetPosition - offset, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }
  requestAnimationFrame(animation);
}


function showMenu() {
  burgerMenu.className.includes('open') ?  burgerMenu.classList.remove('open') : burgerMenu.classList.add('open') 
}


async function sendForm(e) {
  e.preventDefault();
  form.querySelector('.submit').setAttribute('disabled', true);
  // Create and populate formData
  const formData = new FormData(form);
  const res = await fetch(
    'https://script.google.com/macros/s/AKfycbyUBra9cMW7F9X9oHj5FSBNlsS1L1ZrYXkETziYnW2nh6-yJKw/exec',
    {
      method: 'POST',
      body: formData
    }
  );
  const data = await res.json();
  if (data.result === 'success') form.querySelector('.submit').setAttribute('disabled', true);
  if (data.result != 'success') form.querySelector('.submit').setAttribute('disabled', false);
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////* START OF SLIDER */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function startSlider() {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const sliderArrows = document.querySelectorAll('.slider-arrow');
  const sliderDots = document.querySelectorAll('.slider-dot');

  function smoothSliderScroll(target, duration = 350) {
    const targetPosition = target.getBoundingClientRect().left;
    const startPosition = slider.scrollLeft;
    const offset = slider.getBoundingClientRect().left;
    let startTime = null;
  
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, targetPosition - offset, duration);
      slider.scrollLeft = run;
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
  }
  

  sliderArrows.forEach((arrow, i) =>
    arrow.addEventListener('click', () => {
        if (i) {
            let flag = true;
            sliderDots.forEach((dot, j) => {
                if (dot.className.includes('active') && flag) {
                    smoothSliderScroll(slides[j + 1]);
                    dot.classList.remove('active');
                    sliderDots[j + 1].classList.add('active');
                    flag = false;
                }
            });
        } else {
            sliderDots.forEach((dot, i) => {
                if (dot.className.includes('active')) {
                    smoothSliderScroll(slides[i - 1]);
                    dot.classList.remove('active');
                    sliderDots[i - 1].classList.add('active');
                }
            });
        }
    })
  );

  sliderDots.forEach((dot, i) =>
    dot.addEventListener('click', () => {
        smoothSliderScroll(slides[i]);
        sliderDots.forEach(dot => dot.classList.remove('active'));
        dot.classList.add('active');
    })
  );

  resetSlider();
  function resetSlider() {
    smoothSliderScroll(slides[0]);
    sliderDots.forEach(dot => dot.classList.remove('active'));
    sliderDots[0].classList.add('active');
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////* START OF SHOPPING CART SCRIPT */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function startCart() {
  // Elements
  const cartBtn = document.querySelector('.cart-btn');
  const cartBtnMobile = document.querySelector('.cart-btn-mobile');
  const closeCartBtn = document.querySelector('.close-cart');
  // const clearCartBtn = document.querySelector('.clear-cart');
  const cartDOM = document.querySelector('.cart');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartItemsCount = document.querySelector('.cart-items');
  const cartItemsCountMobile = document.querySelector('.cart-items-mobile');
  const cartTotalDOM = document.querySelector('.cart-total');
  const cartContent = document.querySelector('.cart-content');
  let productsList = document.querySelector('.products-list');

  // Cart - Global Variables - Storage
  let cart = [];
  if (sessionStorage.getItem('cart')) {
    cart = JSON.parse(sessionStorage.getItem('cart'));
  } else {
    cart = [];
  }
  let addToCartBtns;
  let cartTotal

  // UI - Display Product
  function displayAllProducts() {
    let result = '';
    products.forEach(product => {
      result += `
        <li data-id="${product.id}">
          <div class="item-img">
              <img src="${product.image}" alt="item">
              <!-- <a class="item-link" href="${product.link}"> To Active Img Link -->
              <div class="item-img--screen">
                  <button class="add-to-cart" data-id="${product.id}">Añadir Al Carro</button>
              </div>
          </div>
          <a data-id="${product.id}" class="item-title">${product.title}</a>
          <h1 class="item-price">$${product.price}</h1>
        </li>
        `;
    });
    if (productsList) productsList.innerHTML = result;
    setCartValues();
    cart.forEach(item => addCartItem(item));

    document.querySelectorAll('.item-title').forEach(link => link.addEventListener('click', goToProduct));
  }
  function displayProducts(title) {
    const filteredProducts = [...products.filter(item => item.category === title)];

    let result = '';
    filteredProducts.forEach(product => {
      result += `
        <li data-id="${product.id}">
          <div class="item-img">
              <img src="${product.image}" alt="item">
              <!-- <a class="item-link" href="${product.link}"> To Active Img Link -->
              <div class="item-img--screen">
                  <button class="add-to-cart" data-id="${product.id}">Añadir Al Carro</button>
              </div>
          </div>
          <a data-id="${product.id}" class="item-title">${product.title}</a>
          <h1 class="item-price">$${product.price}</h1>
        </li>
        `;
    });
    if (productsList) productsList.innerHTML = result;
    setCartValues();
    cart.forEach(item => addCartItem(item));

    document.querySelectorAll('.item-title').forEach(link => link.addEventListener('click', goToProduct));
  }

  function getAddToCartBtns() {
    addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
      const { id } = btn.dataset;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        btn.textContent = 'En Carro';
        btn.classList.add('in-cart');
        btn.disabled = true;
      } else {
        btn.textContent = 'Añadir Al Carro';
        btn.classList.remove('in-cart');
        btn.disabled = false;
      }

      const addToCart = (e) => {
        if(e.target.textContent === 'En Carro') {
          e.target.textContent = 'Añadir Al Carro';
          e.target.classList.remove('in-cart');
          e.target.disabled = false;
        } else {
          e.target.textContent = 'En Carro';
          e.target.classList.add('in-cart');
          e.target.disabled = true;
          // Get product
          const item = products.find(item => item.id === e.target.dataset.id);
          item.amount = 1;
          insertItemToCart(item);
          addCartItem(item);
          setCartValues();
          showCart();
          saveCart();
        }
      };
      btn.addEventListener('click', addToCart);
    });
  }

  function insertItemToCart(item) {
    cart = [...cart, item];
  }

  function setCartValues() {
    let tempTotal = 0;
    let itemsTotal = 0;
    let cartItems = cartContent.querySelectorAll('.cart-item');
    cart.map((item, i) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
      // Change current item total amount
      if (cartItems[i]) {
        cartItems[i].querySelector('.item-total-amount').textContent = `$${parseFloat(
          (item.price * item.amount).toFixed(2)
        )}`;
      }
    });
    cartTotal = parseFloat(tempTotal.toFixed(2));
    cartTotalDOM.textContent = cartTotal;
    cartItemsCount.textContent = itemsTotal;
    cartItemsCountMobile.textContent = itemsTotal;
  }

  function addCartItem(item) {
    const itemTag = document.createElement('div');
    itemTag.classList.add('cart-item');
    itemTag.innerHTML += `
    <img src="${item.image}" alt="">
    <div class="cart-item--contents">
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <h4 class="remove-item" data-id="${item.id}">quitar</h4>
    </div>
    <div class="cart-item--amount">
        <h4 class="item-total-title">Total</h4>
        <h4 class="item-total-amount">$${parseFloat((item.price * item.amount).toFixed(2))}</h4>
    </div>
    <div class="cart-item--controls">
        <img class="item-up" data-id="${item.id}" src="./css/svgs/arrow.svg">
        <p class="item-amount">${item.amount}</p>
        <img class="item-down" data-id="${item.id}" src="./css/svgs/arrow.svg">
    </div>
    `;
    insertElementToCart(itemTag);
  }

  function insertElementToCart(element) {
    cartContent.appendChild(element);
  }

  function showCart() {
    cartOverlay.classList.add('showCart');
    cartDOM.classList.add('showCart');
  }

  function closeCart() {
    cartOverlay.classList.remove('showCart');
    cartDOM.classList.remove('showCart');
  }

  function clearCart() {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeCart();
  }

  function removeItem(id) {
    cart = cart.filter(item => item.id != id);
    setCartValues();
    saveCart();
    let btn = getSingleBtn(id);
    btn.disabled = false;
    btn.textContent = 'Añadir Al Carro';
    btn.classList.remove('in-cart');
  }

  function getSingleBtn(id) {
    return [...addToCartBtns].find(btn => btn.dataset.id === id);
  }

  function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }

  function itemControls(e) {
    const control = e.target.className;
    const { id } = e.target.dataset;
    if (control.includes('remove')) {
      cartContent.removeChild(e.target.parentElement.parentElement);
      removeItem(id);
    }

    if (control.includes('up')) {
      let tempItem = cart.find(item => item.id === id);
      tempItem.amount += 1;
      saveCart(cart);
      setCartValues(cart);
      e.target.nextElementSibling.textContent = tempItem.amount;
    }

    if (control.includes('down')) {
      let tempItem = cart.find(item => item.id === id);
      tempItem.amount -= 1;
      if (tempItem.amount > 0) {
        saveCart(cart);
        setCartValues(cart);
        e.target.previousElementSibling.textContent = tempItem.amount;
      } else {
        cartContent.removeChild(e.target.parentElement.parentElement);
        removeItem(id);
      }
    }
  }

  // Listeners
  closeCartBtn.addEventListener('click', closeCart);
  cartBtn.addEventListener('click', showCart);
  cartBtnMobile.addEventListener('click', showCart);
  // clearCartBtn.addEventListener('click', clearCart);
  cartDOM.addEventListener('click', itemControls);
  cartOverlay.addEventListener('click', (e) => {
    if(e.target.className.includes('cart-overlay')) closeCart();
  })


  // Start Cart
  productsList = document.querySelector('.products-list');
  await getProducts();
  cartContent.innerHTML = '';
  const title = new URLSearchParams(window.location.search).get('categoria');
  if(title === 'todos') {
    displayAllProducts();
  } else {
    displayProducts(title);
  }
  getAddToCartBtns();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////* END OF JAVASCRIPT CART */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////* START OF COMPONENTS */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Elements //
let productsLinks = document.querySelectorAll('.products--content a');
let productLinks = document.querySelectorAll('.item-title');

productLinks.forEach(link => link.addEventListener('click', goToProduct));

// Functions //
// Products Page
async function getProductsPage() {
  // Get Products HTML TEXT
  const res = await fetch('./js/components/productos.txt');
  let data = await res.text();
  // Change Title
  let title = new URLSearchParams(window.location.search).get('categoria');
  if(!title || title.length === 0)  {
    const res =  await fetch('./js/components/error.txt');
    let data = await res.text();
    // Insert Main
    document.querySelector('main').innerHTML = data;
    return
  }
  title = title.replace(/-/g, ' ');
  data = data.replace(/TITLE/, title);
  // Insert Main
  document.querySelector('main').innerHTML = data;

  // Start Cart
  await getProducts();
  startCart();
  loadCategories();
  startSearchbar();
}

// Single Product Page
async function goToProduct(e) {
  e.preventDefault();
  window.location.href = `./producto.html?producto=${e.target.parentElement.dataset.id}`;
}
async function getProductPage() {
  startCart();
  // Get Products HTML TEXT
  let res =  await fetch('./js/components/producto.txt');
  let data = await res.text();
  let id = new URLSearchParams(window.location.search).get('producto');
  const current = [...products.filter(item => item.id === id)][0];

  // Show Error if nothing was found
  if(!id || id.length === 0)  {
    const res =  await fetch('./js/components/error.txt');
    let data = await res.text();
    // Insert Main
    document.querySelector('main').innerHTML = data;
    startCart();
    return
  }
  // Change Title
  data = data.replace(/TITLE/, current.title);
  // Change Image Source
  data = data.replace(/IMG_SRC/, current.image);
  // Change Price
  data = data.replace(/PRICE/, current.price);
  // Change ID
  data = data.replace(/DATA_ID/, current.id);

  // Insert Main
  document.querySelector('main').innerHTML = data;
  
  // Start Cart
  startCart();
  startSearchbar();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////* START OF PAYPAL  */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadPaypal() {
  // Elements
  const paypalBtn = document.querySelector('.paypal-btn');
  const shoppingCart = {};
  shoppingCart.total = 50.0;
  
  // Functions
  paypal_sdk
  .Buttons({
    style: {
      layout: 'vertical',
      color:  'blue',
      shape:  'rect',
      label:  'pay'
    },
    createOrder(data, actions) {
      // This function sets up the details of the transaction, including the amount and line item details.
      return actions.order.create({
        purchase_units: [
          {
            description: 'Total En Carro',
            amount: {
              currency_code: "USD",
              value: cartTotal
            }
          }
        ]
        });
      },
      onApprove(data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
          // This function shows a transaction success message to your buyer.
          paypalBtn.innerHTML = `
          <div class="success">
            <p>Transaction completed by: ${details.payer.name.given_name} ${details.payer.name.surname}<p/>
            <p>Transaction Status: ${details.status}<p/>
            <p>Payment Capture ID: ${details.purchase_units[0].payments.captures[0].id} <p/>
            <p>Price: ${details.purchase_units[0].payments.captures[0].amount.currency_code} ${details.purchase_units[0].payments.captures[0].amount.value}<p/>
          </div>
          `;
        });
      },
      onError: err => {
        paypalBtn.innerHTML = `
          <div className="error">
            An ERROR ocurred.
          </div> 
        `;
      }
    })
    .render(paypalBtn);   
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////* SELECT PAYMENT  */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function selectPayment() {
  const selectDOM = document.querySelector('.payment-select');
  selectDOM.addEventListener('change', changePayment);
  const paymentDOM = document.querySelector('.payment-list');

  function changePayment() {
    const selectedPayment = paymentDOM.querySelector(`.${this.value}`);
    [...paymentDOM.children].forEach(child => child.classList.add('display-none'));
    selectedPayment.classList.remove('display-none');
  };
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////* lOAD CATEGORIES  */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function loadCategories() {
  // Elements
  const categoriesDropdownDOMArray = document.querySelectorAll('.category-dropdown');
  const categoriesDOMArray = document.querySelectorAll('.category-list');
  // Listeners
  categoriesDropdownDOMArray.forEach(btn => btn.addEventListener('click', openCategories))
  await getProducts();
  const keys = Object.keys(categories);
  for (const key of keys) {
    categoriesDOMArray.forEach(list => list.innerHTML += `<li><a href="./productos.html?categoria=${key}">${key}</a></li>`);
  }

  function openCategories() {
    categoriesDOMArray.forEach(list => list.classList.toggle('open'));
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////* START SEARCHBAR  */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function startSearchbar() {
  // Elements
  const searchInput = document.querySelector('.search-input');
  const searchResult = document.querySelector('.search-result');
  // Listeners
  searchInput.addEventListener('input', displayProduct);
  searchResult.addEventListener('click', focusInput);

  function focusInput(e) {
    searchInput.focus();
  }
  
  function findProduct(word, products) {
    return products.filter(product => {
      const regex = new RegExp(word, 'gi'); //Globar Search | Insensitive (Upper or Lower case)
      return product.title.match(regex);
    })
  }
  function displayProduct(){
    const matchArray = findProduct(this.value, products); //this.value is whatever the person is searching
    let html = '';
    matchArray.map(product => {
        html += `
        <li>
        <div class="item-img">
        <img src="${product.image}" alt="item">
        </div>
        <div data-id="${product.id}">
        <a data-id="${product.id}" class="item-title">${product.title}</a>
            <h1 class="item-price">$${product.price}</h1>
            </div>
            </li>
        `;
    });
    searchResult.innerHTML = html;
    if(this.value === '') searchResult.innerHTML = '';
    document.querySelectorAll('.item-title').forEach(link => link.addEventListener('click', goToProduct));
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////* START SEARCHBAR  */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function getProductsTag() {
  // Elements
  const productsContent = document.querySelector('.products--content');
  await getProducts();
  const keys = Object.keys(categories);
  let counter = 0;
  for (const key of keys) {
    counter++
    if(counter < keys.length) productsContent.innerHTML += `<a href="./productos.html?categoria=${key}"><li>${key}</li></a>`;
  }
}

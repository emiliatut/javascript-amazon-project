import { renderPaymentSummary } from "../scripts/checkout/paymentSummary.js";

// DEFINING CART 
export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  /*if (!cart) {
    cart = [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }];  
  }
  */
  updateCartQuantity();
}

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ADD TO CART
export function addToCart(productId) {
  // let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  
  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1',
    });
    saveToStorage();
  }

  updateCartQuantity();
  saveToStorage();
}

// UPDATE CART QUANTITY
export function updateCartQuantity() {
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }
}

// SELECT QUANTITY 
export function updateCartQuantityForProduct(productId, quantity) {
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity = quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1',
    });
  }

  saveToStorage(); 
  updateCartQuantity(); 
}

  
// CHECKOUT (ITEMS: X)
function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartQuantityInHeader() {
  const cartQuantity = getCartQuantity(); 
  const cartQuantityElement = document.querySelector('.js-checkout-items');
  
  if (cartQuantityElement) {
    cartQuantityElement.textContent = cartQuantity; 
  }
}

updateCartQuantityInHeader();


// REMOVING FROM CART
export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();

  console.log('Cart after removal:', cart);
}

// UPDATE DELIVERY OPTIONS
export function updateDeliveryOption(productId, deliveryoptionId) {
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryoptionId;
    saveToStorage();
  } else {
    console.error(`No cart found with productId: ${productId}`);
  }

  renderPaymentSummary();
}


// LOAD CART BACKEND
export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {

    
    fun();
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

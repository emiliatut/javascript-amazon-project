import { cart } from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { updateCartQuantity } from "../../data/cart.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

// TRACKING FUNCTION
export function addToTracking(productId){
  let matchingItem;
  let productTracked;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (productTracked) {
      matchingItem.quantity += 1;
    } else {
      productTracked = {
        productId: productId,
        quantity: `${cartItem.quantity}`,
        deliveryOptionId: '1',
      };
      saveToStorage();
    }
}

// GENERATING TRACKING HTML
export function renderTracking() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productId');

  let trackingHTML = '';

  
  cart.forEach((cartItem) => {
    const matchingProduct = getProduct(cartItem.productId);

    if (!matchingProduct) {
          console.error(`Skipping rendering for productId: ${cartItem.productId} as no matching product was found.`);
          return;
        }
    
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    if (!deliveryOption) {
      console.error(`Skipping rendering for deliveryOptionId: ${cartItem.deliveryOptionId} as no matching option was found.`);
      return;
    } 
  
    const deliveryDate = dayjs().add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
  
    trackingHTML += `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
    
      <div class="delivery-date">
        Arriving on ${dateString}
      </div>
    
      <div class="product-info">
        ${matchingProduct.name}
      </div>
    
      <div class="product-info">
        Quantity: ${cartItem.quantity}
      </div>
    
      <img class="product-image" src="${matchingProduct.image}">

      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div> 
    `;
  }); 

  const orderTracking = document.querySelector('.js-order-tracking');
  if (orderTracking) {
    orderTracking.innerHTML = trackingHTML;
  } else {
    console.error("Order Tracking not found in the DOM.");
  }

  updateCartQuantity();
}

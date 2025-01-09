import { cart } from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { updateCartQuantity } from "../../data/cart.js";

// ORDER DETAILS
export function renderOrderDetails () {
  let orderDetailsHTML = '';

  const latestOrder = JSON.parse(localStorage.getItem("latestOrder"));
  const orderPlacedDate = latestOrder ? latestOrder.date : "Unknown date";
  const orderTotal = latestOrder ? latestOrder.total : "$0.00";

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
    const dateString = deliveryDate.format('dddd, D');

    orderDetailsHTML += `
      <div class="product-image-container">
        <img src="${matchingProduct.image}" alt="${matchingProduct.name}">
      </div>
      <div class="product-details">
        <div class="product-name">${matchingProduct.name}</div>
        <div class="product-delivery-date">Arriving on: ${dateString}</div>
        <div class="product-quantity">Quantity: ${cartItem.quantity}</div>
        <button class="buy-again-button button-primary">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>
      <div class="product-actions">
       <a href="tracking.html?orderId=27cba69d-4c3d-4098-b42d-ac7fa62b7664&productId=${cartItem.productId}">
        <button class="track-package-button button-secondary js-tracking-product" 
        data-product-id="${cartItem.productId}">Track package</button>
      </a>

      </div>`;
  });

  const orderHeaderHTML = `
      <div class="order-header-left-section">
        <div class="order-date">
          <div class="order-header-label">Order Placed:</div>
          <div>${orderPlacedDate}</div>
        </div>
        <div class="order-total">
          <div class="order-header-label">Total:</div>
          <div>$${orderTotal}</div>
        </div>
      </div>
    </div>
    
    <div class="order-header-right-section">
      <div class="order-header-label">Order ID:</div>
      <div>27cba69d-4c3d-4098-b42d-ac7fa62b7664</div>
    </div>
`;

  const orderHeader = document.querySelector(".js-order-header");
  if (orderHeader) {
    orderHeader.innerHTML = orderHeaderHTML;
  }

  const orderDetailsGrid = document.querySelector(".js-order-details-grid");
  if (orderDetailsGrid) {
    orderDetailsGrid.innerHTML = orderDetailsHTML;
  } else {
    console.error("Order details grid container not found in the DOM.");
  }

 updateCartQuantity();
}

import {cart, removeFromCart, saveToStorage, updateDeliveryOption} from '../../data/cart.js';
import {getProduct, products} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';

// RENDER ORDER SUMMARY
export function renderOrderSummary() {

  // CHECKING FOR UNLOADED DATA
  if (!products || products.length === 0) {
    console.error('Products array is not loaded!');
    return;
  }
  
  if (!cart || cart.length === 0) {
    console.error('Cart array is empty or not loaded!');
    return;
  }  
  
  // CART SUMMARY
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    /* Addition to handle poorly handled data: */
    if (!matchingProduct) {
      console.error(`Skipping rendering for productId: ${productId} as no matching product was found.`);
      return; // Skip rendering for this cart item
    }

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    cartSummaryHTML +=
    `
    <div class="cart-item-container 
    js-cart-item-container
    js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${dateString}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          ${matchingProduct.getPrice()}
        </div>
        <div class="product-quantity
          js-product-quantity-${matchingProduct.id}">
          <span>
            Quantity: <span class="quantity-label 
            js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
          </span>
          <span class="delete-quantity-link link-primary js-delete-link
          js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionsHTML(matchingProduct, cartItem)}
      </div>
    </div>
    </div>
    `;
  });

  // DELIVERY DATES
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html +=
        `
          <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
            <input type="radio"
              ${isChecked ? 'checked' : ''}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} - Shipping
              </div>
            </div>
          </div>

        `;
    });

    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;
  
  /*
  document.querySelector('.js-checkout')
    .innerHTML = `Items: ${cartQuantity}`;
  */

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();

        renderPaymentSummary();
      });
      saveToStorage();
    });

  // DELIVERY OPTIONS
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const productId = element.dataset.productId;
        const deliveryOptionId = element.dataset.deliveryOptionId;

        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
    
} // end of renderOrderSummary() function !!


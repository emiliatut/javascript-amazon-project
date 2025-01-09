import {cart} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';
import { addOrder } from '../../data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

// RENDER PAYMENT SUMMARY
export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    // Step 1: Handling product variable
    const product = getProduct(cartItem.productId);

    if (!product) {
      console.error(`Skipping payment summary for invalid productId: ${cartItem.productId}`);
      return;
    }

    productPriceCents += product.priceCents * cartItem.quantity;

    // Step 2: Handling delivery options
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML =
  `
    <div class="payment-summary-title">
    Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (3):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary') 
    .innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {

      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });
  
        const order = await response.json();
        addOrder(order);
  
      } catch(error) {
        console.log('Unexpected error.Try again later');
      }

      const today = dayjs();
      const currentDate = today.format('MMMM D');

      const totalOrderCents =
        cart.reduce((total, cartItem) => {
          const product = getProduct(cartItem.productId);
          if (!product) return total;
          return (
            total +
            product.priceCents * cartItem.quantity +
            getDeliveryOption(cartItem.deliveryOptionId).priceCents
          );
        }, 0) * 1.1;

      const totalOrder = formatCurrency(totalOrderCents);

      const latestOrder = { date: currentDate, total: totalOrder };
      console.log('Saving to localStorage:', latestOrder);

      localStorage.setItem('latestOrder', JSON.stringify(latestOrder));

      window.location.href = 'orders.html';
    });  
}
/*
console.log('Cart Item:', cartItem);
console.log('Product for Cart Item:', product);
*/
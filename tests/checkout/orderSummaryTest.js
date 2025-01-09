import {renderOrderSummary} from '../../scripts/checkout/orderSummary.js';
import {loadFromStorage} from '../../data/cart.js';
import { loadProductsFetch } from '../../data/products.js';


describe('test suite: renderOrederSummary', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeAll((done) => {
    loadProductsFetch().then(() => {
      done();
    });
  });

  beforeEach(() => {

    spyOn(localStorage, 'setItem');
    document.querySelector('.js-test-container')
      .innerHTML = `
        <div class="js-test-container"></div>
      `;

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: productId2,
        quantity: 1,
        deliveryOptionId: '2'
      }] );
    });

    loadFromStorage();

    renderOrderSummary();
  });

  it ('displays the cart', () => {

    expect(
      document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(
      document.querySelector(`.js-quantity-label-${productId1}`).innerText
    ).toContain('Quantity: 2');
    expect(
      document.querySelector(`.js-quantity-label-${productId2}`).innerText
    ).toContain('Quantity: 1');

    document.querySelector('.js-test-container')
    .innerHTML = ``;

  });

  it ('removes a product', () => {

    document.querySelector(`.js-delete-link-${productId1}`).click();

    expect(
      document.querySelectorAll('.js-cart-item-container').length).toEqual(1);

    document.querySelector('.js-test-container')
      .innerHTML = ``;
  
  });
});
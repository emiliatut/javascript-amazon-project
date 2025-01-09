import {addToCart, cart, updateCartQuantity, updateCartQuantityForProduct} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';

loadProducts(() => {
  renderProductsGrid();
  updateCartQuantity();
});

function renderProductsGrid(){

  let productsHTML = '';

  products.forEach((product) => {
    productsHTML += `
      <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="${product.getStarsURL()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
      ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select class="js-homepage-quantity" data-product-id="${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
    `;
  });

document.querySelector('.js-products-grid')
  .innerHTML = productsHTML;

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    addToCart(productId);
    console.log(cart);
  });
});

document.querySelectorAll('.js-homepage-quantity').forEach((selectElement) => {
  selectElement.addEventListener('change', () => {
    const productId = selectElement.dataset.productId; 
    const quantity = parseInt(selectElement.value, 10); 

    updateCartQuantityForProduct(productId, quantity);
  });
});

}


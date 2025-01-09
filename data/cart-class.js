class Cart {
  cartItems;
  #localStorageKey;

  constructor(localStorageKey) {
    // SETUP
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));
    if (!this.cartItems) {
      this.cartItems = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }];  
    }    
  }

  saveToStorage() {
    this.#localStorageKey.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }

  // ADDING TO CART
  addToCart(productId) {
    // let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    
    if (matchingItem) {
      matchingItem.quantity += 1;
    } else {
      this.cartItems.push({
        productId: productId,
        quantity: 1,
        deliveryOptionId: '1',
      });
      this.saveToStorage();
    }
  }

  // REMOVING FROM CART
  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });
    this.cartItems = newCart;

    this.saveToStorage();

    console.log('Cart after removal:', cart);

    // Recalculate cart quantity
    let cartQuantity = this.cartItems.reduce((total, item) => total + item.quantity, 0);

    // Update the cart quantity in the DOM
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

    this.saveToStorage();

    console.log('Cart after addition:', this.cartItems);
  }

  // UPDATE DELIVERY OPTIONS
  updateDeliveryOption(productId, deliveryoptionId) {
    let matchingItem = this.cartItems.find((cartItem) => cartItem.productId === productId);

    if (matchingItem) {
      matchingItem.deliveryOptionId = deliveryoptionId;
      this.saveToStorage();
    } else {
      console.error(`No cart found with productId: ${productId}`);
    }
    console.log('Cart after updating delivery option:', this.cartItems);
  }
}

// CLASSIC CART 
const cart = new Cart('cart-oop');

// BUSINESS CART
const businessCart = new Cart('cart-business');

console.log(cart);
console.log(businessCart);

console.log(businessCart instanceof Cart);
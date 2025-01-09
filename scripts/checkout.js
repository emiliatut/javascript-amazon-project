import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

//import '../data/cart-class.js';
// import '../data/backend-practice.js';

// ASYNC AWAIT
async function loadPage() {

  try {

    await loadProductsFetch();
  
    await new Promise((resolve, reject) => {
      loadCart((error) => {
        if(error) {
          reject(new Error('Failed to lead cart.'));
        } else {
          resolve();
        }
      });
    });  
    renderOrderSummary();
    renderPaymentSummary();
  
  } catch (error) {
    console.log('Unexpected error. Try again later');
  }
}
loadPage();

//
// COURSE STUFF
//

/*PROMISE ALL
Promise.all([

  loadProductsFetch(),

  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })
]).then(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/* PROMISE BASIC
new Promise((resolve) => {
  loadProducts(() => {
    resolve();
  });

}).then(() => {
  return new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  });

}).then(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/* CALLBACKS
loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
    renderPaymentSummary();  
  });
});
*/
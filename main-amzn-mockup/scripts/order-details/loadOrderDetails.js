import { loadProductsFetch } from "../../data/products.js";
import { loadCart } from "../../data/cart.js";
import { renderOrderDetails } from "./orders.js";

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
    renderOrderDetails();

  } catch (error) {
    console.log('Unexpected error. Try again later');
  }
}
loadPage();

import { loadProductsFetch } from "../../data/products.js";
import { loadCart } from "../../data/cart.js";
import { renderTracking } from "./tracking.js";

async function loadPage() {

  //try {

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
    renderTracking();

  //} catch (error) {
  //  console.log('Unexpected error. Try again later');
  //}
}
loadPage();

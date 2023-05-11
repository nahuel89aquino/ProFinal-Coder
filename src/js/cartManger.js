import fs from 'fs';
import { generateUniqueID } from '../utils/id.js';

class CartManager {
    path;
    constructor (path){
        this.path = path;
        
    }
    async getCarts(){
        
        if (!fs.existsSync(this.path)) {
            
            try {
                await fs.promises.writeFile(this.path, "[]");
            } catch (error) {
                throw new Error(error.message);
            }
        } 
        return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
        
    };
    async addCart(){
        try {
            const carts = await this.getCarts();
            const id = generateUniqueID();
            carts.push({ cid: id, products: []});
            const cartsJSon = JSON.stringify(carts)
            await fs.promises.writeFile(this.path,cartsJSon);
        } catch (error) {
            throw new Error(error.message); 
        }

    };

    async getListProducts(cid){
        try {
            const carts = await this.getCarts();
            const index = carts.findIndex( cart => cart.cid === cid )
            if (index < 0){
                throw new Error("cart not found");
            }else{
                return carts[index].products;
            }
        } catch (error) {
            throw new Error(error.message); 
        }
    };

    async addProductToCart(cid, pid){
        try {
            const carts = await this.getCarts();
            const indexCart = carts.findIndex(cart => cart.cid === cid);
            
            const products = carts[indexCart].products;
            const indexProd = products.findIndex(prod => prod.pid === pid)
            if (indexProd < 0){
                products.push({pid: pid, quantity : 1});
            } else{
                products[indexProd].quantity++;
            }
            carts[indexCart].products = products;
            const cartsJSon = JSON.stringify(carts)
            await fs.promises.writeFile(this.path,cartsJSon);
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

}

export default CartManager;
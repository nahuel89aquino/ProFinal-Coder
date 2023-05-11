import { Router } from "express";
import CartManager from "../js/cartManger.js";
import ProductManager from "../js/productManger.js";

const routerCarts = Router();
const cartManger = new CartManager("./carritos.json");
const prodManger = new ProductManager("./productos.json");
routerCarts.post("/", async (req, res) => {
    try {
        await cartManger.addCart();
        return res.status(200).json({status:"success", payload: "cart created"})
    } catch (error) {
        return res.status(500).json({status: "error", payload: "cart not created!"})
    }

});
routerCarts.get("/:cip", async (req, res) => {
    try {
        const products = await cartManger.getListProducts(req.params.cip);
        return res.status(200).json({status:"success", products});
    } catch (error) {
        return res.status(500).json({status: "error", payload: "cart not found!"})
    }

});
routerCarts.post("/:cip/products/:pid", async (req, res) => {
    try {
        const prod = await prodManger.getProductById(req.params.pid);
        if (prod){
            try {
                const pid = prod.id;
                await cartManger.addProductToCart(req.params.cip, pid)
                return res.status(200).json({status:"success",  payload: "added product"});
            } catch (error) {
                return res.status(500).json({status: "error", payload: "cart not found!"})
            }
        }else{
            return res.status(500).json({status: "error", payload: "product not found!"})
        }
    } catch (error) {
        return res.status(500).json({status: "error", payload: error.message})
    }

});

export default routerCarts;



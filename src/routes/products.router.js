import { Router } from "express";
import ProductManager from "../js/productManger.js";

const routerProducts = Router();
const prodManger = new ProductManager("./productos.json");

routerProducts.get("/", async (req,res) =>{
    try {
        const limit = req.query.limit;
        const products = await prodManger.getProducts();
        if (!limit){
            return res.status(300).json({status:"success", products});
        }
        if (limit <= products.length || limit === 0){
            const sliceProd = products.slice(null,limit);
            return res.status(200).json({status:"success", sliceProd} );
            
        }else{
            return res.status(400).json({status:"error", payload: "Limit not found!"})
        }
        
    } catch (error) {
        return res.status(500).json({status: "error", payload: "Product not found!"})
    }
});
routerProducts.get("/:pid", async (req,res) =>{
    const pid = req.params.pid;
    try {
        const product = await prodManger.getProductById(pid);
        if (product){
            return res.status(200).json({status:"success", product})
        }else{
            return res.status(400).json({status: "error", payload:"Product not found!"});
        } 
    } catch (error) {
        return res.status(500).json({status: "error", payload: "Product not found!"})
    }
});

routerProducts.post("/", async (req,res) => {
    if (req.body.id){
        return res.status(400).json({status: "error", payload:"ID field not allowed"});
    }
    try {
        const {title,
               description,
               price,
               thumbnail,
               code,
               stock,
               category,
               status} = req.body;

        await prodManger.addProduct(title,description,price,thumbnail,code,stock,category,status);
        return res.status(200).json({status: "success", payload: "product created"});
        
    } catch (error) {
        return res.status(400).json({status: "error", payload: error.message});
        
    }
});

routerProducts.put("/:pid", async (req,res)=>{
    const id = req.params.pid
    try {
        await prodManger.updateProduct(id,req.body);
        return res.status(200).json({status: "success", payload: "updated product"});
        
    } catch (error) {
        return res.status(400).json({status: "error", payload: error.message});
        
    }

});

routerProducts.delete("/:pid", async (req,res) => {
    const id = req.params.pid
    try {
        await prodManger.deleteProduct(id);
        return res.status(200).json({status: "success", payload: "deleted product"});
        
    } catch (error) {
        return res.status(400).json({status: "error", payload: error.message});
        
    }
});

export default routerProducts;
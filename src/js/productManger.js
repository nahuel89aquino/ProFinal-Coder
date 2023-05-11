import fs from "fs";
import { generateUniqueID } from "../utils/id.js";
class ProductManager{
    path;
    constructor (path){
        this.path = path;
        
    }
    async getProducts(){
        
        if (!fs.existsSync(this.path)) {
            
            try {
                await fs.promises.writeFile(this.path, "[]");
            } catch (error) {
                throw new Error(error.message);
            }
        } 
        return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
        
    }

    async addProduct(title,description,price,thumbnail,code,stock,category,status=true){
        if (!title && !description && !price && !category && !code && !stock) {
            throw new Error('There are unfilled fields');
        }
        const products = await this.getProducts();
        console.log(products);
        if (products.find(prod => prod.code === code )){
            throw new Error('This product already exists');
        }
        let id = generateUniqueID();
        products.push({
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
            });
        const productsJSon = JSON.stringify(products);
        try {
            await fs.promises.writeFile(this.path,productsJSon);
            
        } catch (error) {
            throw new Error(error.message); 
        }
    }    
    async getProductById(id){
        try {
            const productsJson = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(productsJson);   
            return products.find(prod => prod.id === id ) ?? undefined
        } catch (error) {
            throw new Error(error.message); 
        }
    }
    async updateProduct(id,prod){
        if (!prod || !id) {
            throw new Error('missing parameters'); 
        }
        const {title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status} = prod;
        try {
            const productsJson = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(productsJson);
            products.forEach(product => {
                if (id === product.id){
                    product.title = title ?? product.title;
                    product.description = description ?? product.description;
                    product.price = price ?? product.price;
                    product.thumbnail = thumbnail ?? product.thumbnail;
                    product.code = code ?? product.code;
                    product.stock = stock ?? product.stock;
                    product.category = category ?? product.category;
                    product.status = status ?? product.status;
                }
            });
            try {
                await fs.promises.writeFile(this.path,JSON.stringify(products));
            } catch (error) {
                throw new Error(error.message); 
            }
        } catch (error) {
            throw new Error(error.message); 
            
        }
    }
    async deleteProduct(id){
        try {
            const productsJson = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(productsJson);
            const productsResult = products.filter(prod => prod.id != id);
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(productsResult));
            } catch (error) {
                throw new Error(error.message); 
            }
        } catch (error) {
            throw new Error(error.message); 
        }
    }
}

export default ProductManager;
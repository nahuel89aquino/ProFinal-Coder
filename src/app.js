import express from 'express';
import routerProducts from './routes/products.router.js'
import routerCarts from './routes/carts.router.js'

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('static', express.static('public'));

app.use("/api/products",routerProducts);
app.use("/api/carts",routerCarts);

app.get("/", (req,res) => {
    res.json({respuesta: "OK"});

})

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
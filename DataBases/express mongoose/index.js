const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
app.use(methodOverride('_method'));

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.urlencoded({extended:true}));

const Product = require('./models/Product');

//mongoose
const mongoose = require('mongoose');

main()
    .then(()=> console.log("connection open"))
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/farmStand');
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}




app.listen(3000, () =>{
    console.log('listening on 3000');
})

app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save()
    console.log(newProduct);
    res.redirect("products");
})

app.get('/products', async (req,res) => {
    const queryArray = Object.entries(req.query);
    const filtered = queryArray.filter(([key,value]) => value !== '')
    const queryObject = Object.fromEntries(filtered);
    const products = await Product.find(queryObject);
    const category = req.query.category;
    // console.log(products);
    res.render('products/index', {products});
})

app.get('/products/new', (req,res) => {
    res.render('products/new');
})
app.get('/products/:id/edit', async (req,res) =>{
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product});
})

app.get('/products/:id', async( req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render("products/show", {product})
})

app.put('/products/:id', async (req,res) =>{
    const {id} = req.params;
    console.log(id)
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect(`/products/${product.id}`)

})

app.delete('/products/:id', async (req,res) =>{
    const {id} = req.params;
    console.log(id);
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})




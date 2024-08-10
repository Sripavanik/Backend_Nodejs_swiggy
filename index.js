const express=require('express');
const dotenv=require('dotenv');
const vendorRoutes=require('./routes/vendorRoutes');
const bodyParser=require('body-parser');
const firmRoutes=require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes');
const path=require('path');
const app=express();
const PORT=process.env.PORT||4000;
dotenv.config();
const mongoose=require('mongoose');
const productController = require('./controllers/productController');
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Mongodb connected successfully"))
    .catch((error)=>console.log(error))
app.listen(PORT,()=>{
    console.log(`Server started and running at ${PORT}`);
})
app.use(bodyParser.json());
app.use('/',(req,res)=>{
    res.send("<h1> Welcome to Restaurant club");
})
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));
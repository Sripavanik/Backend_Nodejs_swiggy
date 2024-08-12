const express=require('express');
const dotenv=require('dotenv');
const vendorRoutes=require('./routes/vendorRoutes');
const bodyParser=require('body-parser');
const firmRoutes=require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes');
const path=require('path');
const cors=require('cors');
const app=express();
const PORT=process.env.PORT||4000;
dotenv.config();
app.use(cors())
const mongoose=require('mongoose');
const productController = require('./controllers/productController');
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Mongodb connected successfully"))
    .catch((error)=>console.log(error))
app.listen(PORT,()=>{
    console.log(`Server started and running at ${PORT}`);
})
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));
app.use('/', (req, res) => {
    res.json({ message: "Welcome to Restaurant Club" });
});

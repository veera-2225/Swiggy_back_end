const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require("./routes/productRoutes")
const cors = require('cors');
const path =require("path")

const app = express();
app.use(cors())
app.use(express.json())
dotenv.config();

app.use('/vendor', vendorRoutes)
app.use('/firm', firmRoutes)
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'))


const databaseConnect = () => {
    mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully")
}
app.listen(5000, ()=>{
    databaseConnect()
    console.log("Server started at 5000 PORT")
})

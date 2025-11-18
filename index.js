const express = require("express");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require("./routes/productRoutes")
const cors = require('cors');
const path =require("path")

const app = express();
app.use(cors())
app.use(express.json())

app.use('/vendor', vendorRoutes)
app.use('/firm', firmRoutes)
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'))


const databaseConnect = () => {
    mongoose.connect("mongodb+srv://veerababu4p4_db_user:veera1234@cluster0.0ag1s1m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Database connected successfully")
}
app.listen(5000, ()=>{
    databaseConnect()
    console.log("Server started at 5000 PORT")
})

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import productRoute from "./routes/product.js";
import cartRoute from "./routes/cart.js";
import orderRoute from "./routes/order.js";

// setting up the .env variables
dotenv.config();

mongoose.connect(process.env.MONGOURL)
.then(()=>console.log("DB Connection was established"))
.catch(err => console.log(err))



const PORT = 5000
const app = express();

app.use(express.json())

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(process.env.PORT || PORT , ()=>console.log(`APP IS RUNNING IN http://localhost:${process.env.PORT || PORT}`));

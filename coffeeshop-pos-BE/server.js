const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

const connectMongoDB = require("./config/configMongodb");
connectMongoDB();

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const tableRoute = require("./routes/tableRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const customerRoute = require("./routes/customerRoute");

app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/categories", categoryRoute);
app.use("/tables", tableRoute);
app.use("/carts", cartRoute);
app.use("/orders", orderRoute);
app.use("/customers", customerRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
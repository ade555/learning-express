import express from "express";
import usersRouters from "./routes/users.js";
import productRouters from "./routes/products.js";

// initialize express app
const app = express();

// content type to json
app.use(express.json());

app.use(usersRouters);
app.use(productRouters);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>console.log("server started"));

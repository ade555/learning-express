import express from "express";
import usersRouters from "./routes/users.js";
import productRouters from "./routes/products.js";
import cookieParser from "cookie-parser";

// initialize express app
const app = express();
const cookieSecret = "9784yhrjkkj8dmwdk.";

// content type to json
app.use(express.json());

app.use(cookieParser(cookieSecret));
app.use(usersRouters);
app.use(productRouters);

const PORT = process.env.PORT || 3000;

export const helloCookieValue = "testcookie4283849hnd3ii";
app.get('/', (req, res)=>{
    res.cookie('hello', helloCookieValue, {maxAge:60000, signed:true});
    res.send({"msg":"cookie set"});
});

app.listen(PORT, ()=>console.log("server started"));

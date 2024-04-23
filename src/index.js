import express from "express";
import usersRouters from "./routes/users.js";
import productRouters from "./routes/products.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport  from "passport";

// initialize express app
const app = express();
const cookieSecret = "9784yhrjkkj8dmwdk7546trghbneu900rik";

// content type to json
app.use(express.json());

app.use(cookieParser(cookieSecret));
app.use(session({
    secret: cookieSecret,
    saveUninitialized: false,
    resave:false,
    cookie: {
        maxAge:60000 * 60
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(usersRouters);
app.use(productRouters);

const PORT = process.env.PORT || 3000;

export const helloCookieValue = "testcookie4283849hnd3ii";
app.get('/', (req, res)=>{
    res.cookie('hello', helloCookieValue, {maxAge:60000, signed:true});

    // modify session before sending response
    req.session.visited = true;
    console.log(req.session.id);
    res.send({"msg":"cookie set"});
});

app.listen(PORT, ()=>console.log("server started"));

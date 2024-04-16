import { Router } from "express";
import { helloCookieValue } from "../index.js";

const router = Router();

router.get("/api/products/", (req, res)=>{
    console.log(req.signedCookies);
    if (req.signedCookies.hello && req.signedCookies.hello=== helloCookieValue) return res.status(200).send({"message":"this is the product page"});
    return res.status(200).send({"message":"no cookie set"});
});

export default router;
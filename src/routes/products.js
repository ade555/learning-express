import { Router } from "express";

const router = Router();

router.get("/api/products/", (req, res)=>{
    res.status(200).send({"message":"this is the product page"});
});

export default router;
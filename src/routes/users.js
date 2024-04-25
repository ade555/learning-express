import { Router, response } from "express";
import passport from "passport";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidationSchema, userUpdateValidationSchema, loginValidationSchema } from "../utils/validation.js"
import { usersDB } from "../utils/constants.js";
import { resolveUserByIndex } from "../utils/middleware.js";
import { User } from "../mongoose/schemas/users.js";
import "../auth-strategies/local-strategy.js"

const router = Router();


router.param('id', (req, res, next, id)=>{
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidPattern.test(id)) return res.status(400).send("Bad request");
    next();
});

// router.param('id', (req, res, next, id)=>{
//     if (!/^\d+$/.test(id)) return res.status(400).send("id must contain characters from 0-9 only");
//     next();
// });


// get all users
router.get('/api/users/', async (req, res)=>{
    res.status(200).send(await User.find());
});

// create new user
router.post('/api/users/', checkSchema(userValidationSchema), async (req, res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) return res.send(result.array());

    const data = matchedData(req);
    try {
        const newUser = await User.create(data);
        res.status(201).send(newUser);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

// get a user by id
router.get('/api/users/:_id/', async (req, res)=>{
    const {params:{_id}} = req;
    const user = await User.findById(_id);
    if (!user) return res.status(404).send("user not found");
    res.send(user);

});

// update user by id
router.patch('/api/users/:_id/', checkSchema(userUpdateValidationSchema), resolveUserByIndex, async (req, res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) return res.send(result.array());

    const user = req.user;
    if (!user) return res.status(401).send("unauthorized");

    const validatedData = matchedData(req);
    try {
        Object.assign(user, validatedData); // update the user
        const updatedUser = await user.save();
        res.send(updatedUser);
    } catch (err) {
        console.log(`error: ${err}`)
        return res.status(500).send("Unable to update user");
    }
});

// delete user by id
router.delete('/api/users/:_id', resolveUserByIndex, async (req, res)=>{
    const {UserIndex} = req;
    const requestingUser = req.user;
    const user = await User.findById(UserIndex);

    if (!requestingUser || !requestingUser.equals(user)) return res.status(401).send("unauthorized");
    try {
        console.log("before delete");
        await user.deleteOne();
        console.log("after delete");
        res.status(204).send();
    } catch (err) {
        console.log(err);
        return res.status(500).send("Unable to delete user");
    }
});

// fake auth with passportjs
router.post('/api/auth/', checkSchema(loginValidationSchema), passport.authenticate('local'), async (req, res)=>{
    const result = validationResult(req); // check for errors in request body
    if (!result.isEmpty()) return res.send(result.array()); // return errors found in request body

    const validatedData = matchedData(req)
    const currentUser = await User.findOne({username:validatedData.username});
    if (!currentUser || validatedData.password !=currentUser.password) return res.status(401).send({"msg":"Incorrect username or password"});
    req.session.user = currentUser;
    return res.status(200).send(currentUser);
});

// logout
router.post('/api/auth/logout', (req, res)=>{
    if (!req.user) return res.sendStatus(401);
    req.logOut((err)=>{
        if (err) return res.sendStatus(400);
        return res.sendStatus(200);
    });
});
router.get('/api/auth/status/', (req, res)=>{
    return req.user ? res.status(200).send(req.user) : res.status(403).send({"msg":"unauthenticated"});
});


export default router;
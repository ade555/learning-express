import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidationSchema } from "../utils/validation.js"
import { usersDB } from "../utils/constants.js";
import { resolveUserByIndex } from "../utils/middleware.js";

const router = Router();

router.param('id', (req, res, next, id)=>{
    if (!/^\d+$/.test(id)) return res.status(400).send("id must contain characters from 0-9 only");
    next();
});
// get all users
router.get('/api/users/', (req, res)=>{
    res.status(200).send(usersDB);
});

// create new user
router.post('/api/users/', checkSchema(userValidationSchema), (req, res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) return res.send(result.array());

    const data = matchedData(req);
    const newUser = {id:usersDB[usersDB.length -1].id +1, ...data}
    usersDB.push(newUser);
    res.status(201).send(newUser);
});

// get a user by id
router.get('/api/users/:id/', (req, res)=>{
    const {params:{id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.status(400).send("id must contain characters from 0-9 only");

    const UserIndex = usersDB.findIndex((user)=>parsedId==user.id);
    if (UserIndex==-1) return res.status(404).send("user not found");
    const user = usersDB[UserIndex];
    res.send(user);

});

// update user by id
router.patch('/api/users/:id/', checkSchema(userValidationSchema), resolveUserByIndex, (req, res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) return res.send(result.array());

    const validatedData = matchedData(req);
    const {UserIndex} = req;

    usersDB[UserIndex] = {...usersDB[UserIndex], ...validatedData};
    res.send(usersDB[UserIndex]);
});

// delete user by id
router.delete('/api/users/:id', resolveUserByIndex, (req, res)=>{
    const {UserIndex} = req;
    usersDB.splice(UserIndex, 1);
    res.sendStatus(204);
});

export default router;
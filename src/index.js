import express from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidationSchema } from "./utils/validation.js"

// initialize express app
const app = express();

// content type to json
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>console.log("server started"));

const usersDB = [
    { id:1, fullName:"John Doe", username:"johnny" },
    { id:2, fullName:"Jane Doe", username:"jane" },
    { id:3, fullName:"Mary Smith", username:"maryS" },
    { id:4, fullName:"Mark Phillip", username:"phil" },
    { id:5, fullName:"Emmanuel Saka", username:"emma" },
]

app.param('id', (req, res, next, id)=>{
    if (!/^\d+$/.test(id)) return res.status(400).send("id must contain characters from 0-9 only");
    next();
});

const resolveUserByIndex = (req, res, next)=>{
    const {params:{id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.status(400).send("id must contain characters from 0-9 only");

    const UserIndex = usersDB.findIndex((user)=>parsedId==user.id);

    if (UserIndex==-1) return res.status(404).send("user not found");
    req.UserIndex = UserIndex;
    next();
}


// get all users
app.get('/api/users/', (req, res)=>{
    res.status(200).send(usersDB);
});

// create new user
app.post('/api/users/', checkSchema(userValidationSchema), (req, res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) return res.send(result.array());

    const data = matchedData(req);
    const newUser = {id:usersDB[usersDB.length -1].id +1, ...data}
    usersDB.push(newUser);
    res.status(201).send(newUser);
});


// get a user by id
app.get('/api/users/:id/', (req, res)=>{
    const {params:{id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.status(400).send("id must contain characters from 0-9 only");

    const UserIndex = usersDB.findIndex((user)=>parsedId==user.id);
    if (UserIndex==-1) return res.status(404).send("user not found");
    const user = usersDB[UserIndex];
    res.send(user);

});

// update user by id
app.patch('/api/users/:id/', checkSchema(userValidationSchema), resolveUserByIndex, (req, res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) return res.send(result.array());

    const validatedData = matchedData(req);
    const {UserIndex} = req;

    usersDB[UserIndex] = {...usersDB[UserIndex], ...validatedData};
    res.send(usersDB[UserIndex]);
});


// delete user by id
app.delete('/api/users/:id', resolveUserByIndex, (req, res)=>{
    const {UserIndex} = req;
    usersDB.splice(UserIndex, 1);
    res.sendStatus(204);
})
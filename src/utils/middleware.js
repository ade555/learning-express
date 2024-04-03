import { usersDB } from "./constants.js";

export const resolveUserByIndex = (req, res, next)=>{
    const {params:{id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.status(400).send("id must contain characters from 0-9 only");

    const UserIndex = usersDB.findIndex((user)=>parsedId==user.id);

    if (UserIndex==-1) return res.status(404).send("user not found");
    req.UserIndex = UserIndex;
    next();
}
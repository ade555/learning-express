import { usersDB } from "./constants.js";
import { User } from "../mongoose/schemas/users.js";

export const resolveUserByIndex = async (req, res, next)=>{
    const {params:{_id}} = req;

    const UserIndex = await User.findById(_id);

    if (!UserIndex) return res.status(404).send("Bad request");
    req.UserIndex = UserIndex;
    next();
}

// export const resolveUserByIndex = (req, res, next)=>{
//     const {params:{id}} = req;
//     const parsedId = parseInt(id);
//     if (isNaN(parsedId)) return res.status(400).send("id must contain characters from 0-9 only");

//     const UserIndex = usersDB.findIndex((user)=>parsedId==user.id);

//     if (UserIndex==-1) return res.status(404).send("user not found");
//     req.UserIndex = UserIndex;
//     next();
// }
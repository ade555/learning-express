import passport from "passport";
import { Strategy } from "passport-local";
import { usersDB } from "../utils/constants.js";

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    try {
        const finduser = usersDB.find(user=>user.id===id);
        if(!finduser) throw new Error("user not found")
        done(null, finduser);
    } catch (err) {
        done(err, null);
    }

});


export default passport.use(new Strategy((username, password, done)=>{
    try {
        const findUser = usersDB.find((user)=> user.username===username);
        if (!findUser) throw new Error("user not found");
        if (password != findUser.password) throw new Error("invalid credentials");
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }

}));
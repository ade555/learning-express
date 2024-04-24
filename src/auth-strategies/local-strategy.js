import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/users.js";

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser( async(id, done)=>{
    try {
        const finduser = await User.findById(id);
        if(!finduser) throw new Error("user not found")
        done(null, finduser);
    } catch (err) {
        done(err, null);
    }

});


export default passport.use(new Strategy(async(username, password, done)=>{
    try {
        const findUser = await User.findOne({username:username});
        if (!findUser) throw new Error("user not found");
        if (password !== findUser.password) throw new Error("invalid credentials");
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }

}));
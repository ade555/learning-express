import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type: mongoose.Schema.Types.String,
        required: [true, "a username is required"],
        unique : true,
        lowercase:true
    },
    fullName :{
        type: mongoose.Schema.Types.String,
    },
    password : {
        type: mongoose.Schema.Types.String,
        required: true,
        minLength : [8, "password must have at least 8 characters"]
    }
});

export const User = mongoose.model("User", userSchema);
const User=require("../models/userModel");
exports.getUser = async (query) => {
    try {
        const checkUser=await User.findOne(query);
        return checkUser;
    } catch (err) {
        console.log(err);
        throw Error('Error while finding User');
    }
};

exports.newUser=async(query)=>{
    try {
        const user=new User(query);
        const savedUser=user.save();
        return savedUser;
    } catch (err) {
        console.log(err);
        throw Error('Error while saving User');
    }
}

exports.updateUser=async(find,query)=>{
    try {
        const user=await User.updateOne(find,{$set:query});
    } catch (err) {
        console.log(err);
        throw Error('Error while updating User');
    }
}
const Token=require("../models/tokenModel");

exports.getToken = async (query) => {
    try {
        const checkToken=await Token.findOne(query);
        return checkToken;
    } catch (err) {
        console.log(err);
        throw Error('Error while finding Token');
    }
};

exports.newToken=async (query)=>{
    try {
        const token=new Token(query);
        const savedToken=token.save();
        return savedToken;
    } catch (err) {
        console.log(err);
        throw Error('Error while creating Token');
    }
}
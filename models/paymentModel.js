const mongoose=require('mongoose');
const PaymentSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    date:{
        type:String,
        required:true
    },
    verfication:{
        type:String,
        required:true,
        default:"unseen"
    }
},{timestamps:true});

module.exports=mongoose.model("Payment",PaymentSchema);
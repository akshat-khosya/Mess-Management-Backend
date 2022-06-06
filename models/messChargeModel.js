const mongoose=require('mongoose');
const mchargeSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    brekfast:{
        type:Number
    },
    lunch:{
        type:Number
    },
    snacks:{
        type:Number
    },
    dinner:{
        type:Number
    }
},{timestamps:true});

module.exports=mongoose.model("MessCharge",mchargeSchema);
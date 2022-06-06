const mongoose=require('mongoose');
const MessSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    messChargeId:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    brekfast:{
        type:Boolean,
        default:false
    },
    lunch:{
        type:Boolean,
        default:false
    },
    snacks:{
        type:Boolean,
        default:false
    },
    dinner:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

module.exports=mongoose.model("Mess",MessSchema);
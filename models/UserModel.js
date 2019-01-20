var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utilConfig = require('../config/utility-constants')


var userSchema = new Schema({
    name:{type:String, required:true},
    username:{type:String, required:true},
    password:{type:String, required:true},
    bio:{
        profilepic:{type:String,default:''},
        experience:{type:Number,default:0},
        DOB:{type:Date,required:true},
        sex:{type:String,required:true},
        height:{type:Number, required:true},
        weight:{type:Number, required:true},
        bGroup:{type:String,default:''},
        mobile:{type:String, required:true, minlength: 10, maxlength: 10},
        email:{type:String,required:true},
        shift:{type:String},
        criminalCase:{type:String,default:'NO'},
        qualification:{type:String},
        proffession:{type:String},
        skinColor:{type:String},
        address:{
            areapin:Number,
            city:{type:String,maxlength:20},
            state:{type:String,maxlength:20},
            district:{type:String,maxlength:20},
            street:{type:String,maxlength:20},
            fatersname:{type:String,maxlength:30},
            mothersname:{type:String,maxlength:30},
        },
        gymId:{type:String,default:''}
    },
    roles:{type:Array,default:[utilConfig.user]},
    skills:{type:Array,default:[]},
    status:{type:String,default:'Active'},
    created:{
        createdBy:{type:String,default:'Admin'},
        createdAt:{type:Date,default:new Date(+new Date() + 7*24*60*60*1000)}
    },
    updated:{
        updatedBy:{type:String,default:'Admin'},
        updatedAt:{type:Date,default:new Date(+new Date() + 7*24*60*60*1000)}
    },
    trainers:{type:Array,default:[]},
    type_trainee:{type:String,default:''},
    lastlogin:{type:Date}
});

module.exports = mongoose.model('User', userSchema);

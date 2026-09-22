import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,default:'My Shop',trim:true},address:{type:String,default:''},phone:{type:String,default:''},upiId:{type:String,default:''},ownerId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}},{timestamps:true});
export default mongoose.model('Shop',schema);

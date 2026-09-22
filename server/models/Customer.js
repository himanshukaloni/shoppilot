import mongoose from 'mongoose';
const schema=new mongoose.Schema({shopId:{type:mongoose.Schema.Types.ObjectId,ref:'Shop',required:true},name:{type:String,required:true,trim:true},phone:{type:String,default:''},email:{type:String,default:''},address:{type:String,default:''},openingDue:{type:Number,default:0}},{timestamps:true});
export default mongoose.model('Customer',schema);

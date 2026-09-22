import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true},role:{type:String,enum:['OWNER','MANAGER','CASHIER'],default:'OWNER'},shopId:{type:mongoose.Schema.Types.ObjectId,ref:'Shop'}},{timestamps:true});
export default mongoose.model('User',schema);

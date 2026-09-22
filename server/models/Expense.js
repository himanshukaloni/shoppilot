import mongoose from 'mongoose';
const schema=new mongoose.Schema({shopId:{type:mongoose.Schema.Types.ObjectId,ref:'Shop',required:true},title:{type:String,required:true},amount:{type:Number,required:true,min:0},category:{type:String,default:'General'},date:{type:Date,default:Date.now},note:String},{timestamps:true});
export default mongoose.model('Expense',schema);

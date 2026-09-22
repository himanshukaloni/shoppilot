import mongoose from 'mongoose';
const item=new mongoose.Schema({productId:mongoose.Schema.Types.ObjectId,productName:String,quantity:Number,costPrice:Number,subtotal:Number},{_id:false});
const schema=new mongoose.Schema({shopId:{type:mongoose.Schema.Types.ObjectId,ref:'Shop',required:true},supplierName:{type:String,default:''},items:[item],total:Number,paymentStatus:{type:String,enum:['PAID','DUE'],default:'PAID'},notes:String},{timestamps:true});
export default mongoose.model('Purchase',schema);

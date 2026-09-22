import mongoose from 'mongoose';
const item=new mongoose.Schema({productId:mongoose.Schema.Types.ObjectId,productName:String,image:String,quantity:Number,sellingPriceAtSale:Number,costPriceAtSale:Number,subtotal:Number,profit:Number},{_id:false});
const schema=new mongoose.Schema({shopId:{type:mongoose.Schema.Types.ObjectId,ref:'Shop',required:true,index:true},invoiceNumber:{type:String,unique:true},customerId:{type:mongoose.Schema.Types.ObjectId,ref:'Customer',default:null},items:[item],subtotal:Number,discount:{type:Number,default:0},tax:{type:Number,default:0},total:Number,paymentMethod:{type:String,enum:['CASH','UPI','CARD','CREDIT'],default:'CASH'},paymentStatus:{type:String,enum:['PAID','PENDING'],default:'PAID'}},{timestamps:true});
export default mongoose.model('Sale',schema);

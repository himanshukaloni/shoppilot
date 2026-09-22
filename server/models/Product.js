import mongoose from 'mongoose';
const schema=new mongoose.Schema({shopId:{type:mongoose.Schema.Types.ObjectId,ref:'Shop',required:true,index:true},name:{type:String,required:true,trim:true},sku:{type:String,required:true,trim:true},category:{type:String,default:'General'},stock:{type:Number,default:0,min:0},purchasePrice:{type:Number,default:0,min:0},sellingPrice:{type:Number,default:0,min:0},lowStockLimit:{type:Number,default:10,min:0},image:{url:String,fileId:String,name:String}},{timestamps:true});
schema.index({shopId:1,sku:1},{unique:true});
export default mongoose.model('Product',schema);

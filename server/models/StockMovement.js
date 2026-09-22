import mongoose from 'mongoose';
const schema=new mongoose.Schema({shopId:{type:mongoose.Schema.Types.ObjectId,ref:'Shop',required:true},productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},type:{type:String,enum:['OPENING','PURCHASE','SALE','RETURN','DAMAGE','ADJUSTMENT'],required:true},quantity:{type:Number,required:true},previousStock:{type:Number,required:true},newStock:{type:Number,required:true},referenceId:{type:String,default:''},note:{type:String,default:''}},{timestamps:true});
export default mongoose.model('StockMovement',schema);

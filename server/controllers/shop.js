import Shop from '../models/Shop.js';
export async function get(req,res){const shop=await Shop.findById(req.user.shopId);res.json(shop)}
export async function update(req,res){const shop=await Shop.findOneAndUpdate({_id:req.user.shopId,ownerId:req.user._id},{$set:{name:req.body.name,address:req.body.address,phone:req.body.phone,upiId:req.body.upiId}},{new:true,runValidators:true});if(!shop)return res.status(404).json({message:'Shop not found or not owner'});res.json(shop)}

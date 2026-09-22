import Customer from '../models/Customer.js';import Sale from '../models/Sale.js';
export async function list(req,res){res.json(await Customer.find({shopId:req.user.shopId}).sort({createdAt:-1}))}
export async function create(req,res){const c=await Customer.create({...req.body,shopId:req.user.shopId});res.status(201).json(c)}
export async function update(req,res){const c=await Customer.findOneAndUpdate({_id:req.params.id,shopId:req.user.shopId},req.body,{new:true,runValidators:true});if(!c)return res.status(404).json({message:'Customer not found'});res.json(c)}
export async function remove(req,res){await Customer.deleteOne({_id:req.params.id,shopId:req.user.shopId});res.json({message:'Customer deleted'})}
export async function history(req,res){res.json(await Sale.find({shopId:req.user.shopId,customerId:req.params.id}).sort({createdAt:-1}).limit(100))}

import Expense from '../models/Expense.js';
export async function list(req,res){res.json(await Expense.find({shopId:req.user.shopId}).sort({date:-1}).limit(500))}
export async function create(req,res){const e=await Expense.create({...req.body,amount:Number(req.body.amount),shopId:req.user.shopId});res.status(201).json(e)}
export async function remove(req,res){await Expense.deleteOne({_id:req.params.id,shopId:req.user.shopId});res.json({message:'Expense deleted'})}

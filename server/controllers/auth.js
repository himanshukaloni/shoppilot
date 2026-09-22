import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
const safe=u=>({id:u._id,name:u.name,email:u.email,role:u.role,shopId:u.shopId});
const cookieOptions=()=>({httpOnly:true,sameSite:process.env.NODE_ENV==='production'?'none':'lax',secure:process.env.NODE_ENV==='production',maxAge:7*24*60*60*1000});
const tokenFor=u=>jwt.sign({id:u._id,role:u.role,shopId:u.shopId},process.env.JWT_SECRET,{expiresIn:'7d'});
export async function register(req,res){try{const{name,email,password,shopName}=req.body;if(!name||!email||!password)return res.status(400).json({message:'Name, email and password are required'});if(password.length<6)return res.status(400).json({message:'Password must be at least 6 characters'});if(await User.findOne({email:email.toLowerCase()}))return res.status(409).json({message:'Email already registered'});const user=await User.create({name,email,password:await bcrypt.hash(password,12)});const shop=await Shop.create({name:shopName?.trim()||`${name}'s Shop`,ownerId:user._id});user.shopId=shop._id;await user.save();res.cookie('token',tokenFor(user),cookieOptions()).status(201).json({user:safe(user),shop});}catch(e){res.status(500).json({message:e.message})}}
export async function login(req,res){try{const{email,password}=req.body;const user=await User.findOne({email:email?.toLowerCase()});if(!user||!(await bcrypt.compare(password||'',user.password)))return res.status(401).json({message:'Invalid email or password'});res.cookie('token',tokenFor(user),cookieOptions()).json({user:safe(user)});}catch(e){res.status(500).json({message:e.message})}}
export function me(req,res){res.json({user:safe(req.user)})}
export function logout(req,res){res.clearCookie('token',{httpOnly:true,sameSite:process.env.NODE_ENV==='production'?'none':'lax',secure:process.env.NODE_ENV==='production'}).json({message:'Logged out'})}

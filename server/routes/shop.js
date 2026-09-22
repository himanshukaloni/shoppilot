import {Router} from 'express';import {get,update} from '../controllers/shop.js';const r=Router();r.get('/',get);r.put('/',update);export default r;

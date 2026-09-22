import {Router} from 'express';import {createSale,listSales} from '../controllers/sale.js';const r=Router();r.get('/',listSales);r.post('/',createSale);export default r;

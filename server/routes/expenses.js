import {Router} from 'express';import {list,create,remove} from '../controllers/expense.js';const r=Router();r.get('/',list);r.post('/',create);r.delete('/:id',remove);export default r;

import {Router} from 'express';import {summary} from '../controllers/dashboard.js';const r=Router();r.get('/',summary);export default r;

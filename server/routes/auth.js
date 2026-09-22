import {Router} from 'express';import {login,register,me,logout} from '../controllers/auth.js';import {requireAuth} from '../middleware/auth.js';
const r=Router();r.post('/register',register);r.post('/login',login);r.get('/me',requireAuth,me);r.post('/logout',logout);export default r;

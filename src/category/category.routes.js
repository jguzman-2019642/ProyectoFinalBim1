import express from 'express'
import { test, add, update, deleteC, list } from './category.controller.js'
import { validateJwt, isAdmin } from '../middleware/vaidate-jwt.js';

const api = express.Router();

// ---------------------------------RUTAS-----------------------------------------
api.get('/test', test)
api.post('/add',[validateJwt, isAdmin], add)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/delete/:id',[validateJwt, isAdmin], deleteC)
api.get('/list',[validateJwt, isAdmin], list)

export default api
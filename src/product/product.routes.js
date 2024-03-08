import express from 'express'
import { test, add, update, deleteP, list, listName, listCategory} from './product.controller.js'   
import { validateJwt, isAdmin } from '../middleware/vaidate-jwt.js';

const api = express.Router();

api.get('/test', test)
api.post('/add',[validateJwt, isAdmin], add)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/delete/:id',[validateJwt, isAdmin], deleteP)
api.get('/list',[validateJwt, isAdmin], list)
api.post('/listName',[validateJwt, isAdmin], listName)
api.post('/listCategory',[validateJwt, isAdmin], listCategory)

export default api
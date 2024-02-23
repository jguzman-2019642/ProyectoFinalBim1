import express from 'express'
import { test, add, update, deleteP, list, listName, listCategory} from './product.controller.js'

const api = express.Router();

api.get('/test', test)
api.post('/add', add)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteP)
api.get('/list', list)
api.post('/listName', listName)
api.post('/listCategory', listCategory)

export default api
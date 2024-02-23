import express from 'express'
import { test, add, update, deleteC, list } from './category.controller.js'

const api = express.Router();

// ---------------------------------RUTAS-----------------------------------------
api.get('/test', test)
api.post('/add', add)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteC)
api.get('/list', list)

export default api
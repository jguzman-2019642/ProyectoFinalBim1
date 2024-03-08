import express from 'express'
import { test,
        register,
        login,
        update,
        deleteU
          } from './user.controller.js'
import {  validateJwt } from '../middleware/vaidate-jwt.js'

const api = express.Router()

//Rutas publicas
api.get('/test', test)
api.post('/register', register)
api.post('/login', login)
//Rutas privadas (usuarios logeados)
api.put('/update/:id', [validateJwt], update)
api.delete('/deleteU/:id', [validateJwt], deleteU)
//api.post('/search',[validateJwt], search)

export default api
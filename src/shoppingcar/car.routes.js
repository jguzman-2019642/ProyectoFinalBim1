
import  express  from "express"
import { add } from "./car.controller.js"
import { validateJwt } from '../middleware/vaidate-jwt.js'

const api = express.Router()

//Publicas
api.post('/add', [validateJwt], add)

export default api
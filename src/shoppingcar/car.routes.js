
import  express  from "express"
import { add, generateInvoicePDF } from "./car.controller.js"
import { validateJwt } from '../middleware/vaidate-jwt.js'

const api = express.Router()

//Publicas
api.post('/add', [validateJwt], add)
api.post('/generateInvoicePDF',[validateJwt], generateInvoicePDF)
export default api
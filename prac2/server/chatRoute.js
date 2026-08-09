import {Router} from 'express'
import { aiResponseController } from './controllers/response.js'
const chatRoute = Router()

chatRoute.post('/chat', aiResponseController)

export default chatRoute
import {Router} from 'express';
import { authenToken, isAdmin } from '../utils/authServices'
import {
    addOrder,
    getOrdersByFilter,
    setStatus
} from '../controllers/orderController'

const orderRouter = Router()

orderRouter.post('/add', authenToken, addOrder)
orderRouter.get('/admin/getOrdersByFilter', authenToken, isAdmin, getOrdersByFilter)
orderRouter.post('/admin/setStatus', authenToken, isAdmin, setStatus)

export default orderRouter
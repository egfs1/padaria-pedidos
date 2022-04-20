import {Router} from 'express'
import companiesController from './controllers/CompaniesController'
import productsController from './controllers/ProductsController'
import pricesController from './controllers/PricesController'
import ordersController from './controllers/OrdersController'

const router = Router()

router.use('/', companiesController)
router.use('/', productsController)
router.use('/', pricesController)
router.use('/', ordersController)


export default router
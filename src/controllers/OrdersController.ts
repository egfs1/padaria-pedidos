import {Router} from 'express'
import prismaClient from '../prisma'

const router =  Router()

router.get('/', (request, response)=>{
    response.redirect('/orders')
})

router.get('/orders', async(request, response)=> {
    const orders = await prismaClient.orders.findMany({
        orderBy: [
            {
                date: 'desc'
            },
        ],
        include: {
            company: true
        }
    })
    const companies = await prismaClient.companies.findMany({
        orderBy: [
            {
                name: 'desc'
            },
        ],
    })
    response.render('orders', {
        orders: orders,
        companies: companies
    })
})

router.get('/orders/new', async (request, response)=> {
    const company_id = request.query.company_id?.toString()
    console.log(company_id)
    const company = await prismaClient.companies.findUnique({
        where: {
            id: company_id
        }
    })
    const prices = await prismaClient.prices.findMany({
        orderBy: [
            {
                updatedAt: 'asc'
            }
        ],
        where: {
            company_id: company_id,
        },
        include: {
            product: true
        }
    })
    response.render('orders/new', {
        company: company,
        prices: prices,
    })
})

router.post('/orders/save', async (request, response)=> {
    const company_id = request.body.company_id
    const date = new Date(request.body.date)
    const order = await prismaClient.orders.create({
        data: {
            company_id: company_id,
            date: date,
            value: 0
        }
    })

    var product_id = Array.isArray(request.body.product_id) ? request.body.product_id : [request.body.product_id]
    var quantity = Array.isArray(request.body.quantity) ? request.body.quantity : [request.body.quantity]
    
    var total = 0
    for (let index = 0; index < product_id.length; index++) {
        try {
            var price = await prismaClient.prices.findFirst({
                where: {
                    company_id: company_id,
                    product_id: product_id[index],
                },
                rejectOnNotFound: true
            })
            let value = price.price * (parseFloat(quantity[index]))
            total += value
            await prismaClient.subOrders.create({
                data: {
                    company_id: company_id,
                    product_id: product_id[index],
                    order_id: order.id,
                    quantity: parseFloat(quantity[index]),
                    value: value
                }
            })
        } catch (error) {
            response.redirect('/orders')  
        }
    }
    await prismaClient.orders.update({
        where: {
            id: order.id
        },
        data: {
            value: total
        }
    })
    response.redirect('/orders/new/?company_id=' + company_id)
})

router.post('/orders/delete', async (request, response)=>{
    const id = request.body.id
    await prismaClient.orders.delete({
        where: {
            id: id
        }
    })
    response.redirect('/orders')
})

router.post('/orders/edit/:id', async (request, response)=>{
    const id = request.body.id
    const order = await prismaClient.orders.findFirst({
        where: {
            id: id
        },
        include: {
            company: true,
            sub_orders: true
        },
        rejectOnNotFound: true
    })

    const products = await prismaClient.products.findMany({
        orderBy: [
            {
                name: 'desc'
            }
        ]
    })
    
    response.render('orders/edit', {
        order: order,
        products: products
    })
})

router.post('/orders/update', async (request, response)=> {
    const id = request.body.id
    
    const order = await prismaClient.orders.findUnique({
        where: {
            id: id
        },
        include: {
            sub_orders: true
        },
        rejectOnNotFound: true
    })
    var suborders_left = order.sub_orders

    var suborder_id = Array.isArray(request.body.suborder_id) ? request.body.suborder_id : [request.body.suborder_id]
    var product_id = Array.isArray(request.body.product_id) ? request.body.product_id : [request.body.product_id]
    var quantity = Array.isArray(request.body.quantity) ? request.body.quantity : [request.body.quantity]
    var total = 0
    for (let index = 0; index < suborder_id.length; index++) {

        suborders_left.forEach(suborder=>{
            if(suborder.id == suborder_id[index]){
                suborder.id = ''
            }
        })

        try {
            var price = await prismaClient.prices.findFirst({
                where: {
                    company_id: order.company_id,
                    product_id: product_id[index],
                },
                rejectOnNotFound: true
            })
            let value = price.price * (parseFloat(quantity[index]))

            if(suborder_id[index]!= 'null'){
                await prismaClient.subOrders.update({
                    where: {
                        id: suborder_id[index]
                    },
                    data: {
                        product_id: product_id[index],
                        order_id: id,
                        quantity: parseFloat(quantity[index]),
                        value: value
                    }
                })             
            } else {
                await prismaClient.subOrders.create({
                    data: {
                        company_id: order.company_id,
                        product_id: product_id[index],
                        order_id: id,
                        quantity: parseFloat(quantity[index]),
                        value: value
                    }
                })        
            }
            total += value
        } catch (error) {
            console.log('error') 
            return
        }
    }

    suborders_left.forEach(async suborder=>{
        if (suborder.id != ''){
            await prismaClient.subOrders.delete({
                where: {
                    id: suborder.id
                }
            })
        }
    })

    await prismaClient.orders.update({
        where: {
            id: id
        },
        data: {
            value: total
        }
    })
    response.redirect('/orders')

})

router.post('/orders/quantitative', async (request, response)=>{
    const company_id = request.body.company_id
    const month = parseInt(request.body.month)
    const orders = await prismaClient.orders.findMany({
        where: {
            date: {
                gte: new Date(Date.UTC(2022,month-1,1,0,0,0)),
                lte: new Date(Date.UTC(2022,month-1,31,23,59,59)),
            },
            company_id: company_id,
        },
        include: {
            sub_orders: true
        }
    })

    const company = await prismaClient.companies.findUnique({
        where: {
            id: company_id
        }
    })

    const prices = await prismaClient.prices.findMany({
        orderBy: [
            {
                updatedAt: 'asc'
            }
        ],
        where: {
            company_id: company_id,
        },
        include: {
            product: true
        }
    })

    var quantitatives: { product: string; quantity: number; value: number }[] = []
    for (let index = 0; index < prices.length; index++) {
        var quantity = 0
        var value = 0
        orders.forEach(order => {
            order.sub_orders.forEach(suborder => {
                if (prices[index].product_id == suborder.product_id){
                    quantity += suborder.quantity
                    value += suborder.value
                }
            })
        })
        quantitatives.push({
            product: prices[index].product.name,
            quantity: quantity,
            value: value
        })
    }

    response.render('orders/quantitative', {
        quantitatives: quantitatives,
        company: company,
        month: month.toString().padStart(2, '0')
    })

})

export default router
import {Router} from 'express'
import prismaClient from '../prisma'

const router =  Router()

router.get('/prices', async(request, response)=> {
    const prices = await prismaClient.prices.findMany({
        orderBy: [
            {
                updatedAt: 'desc'
            },
        ],
        include: {
            company: true,
            product: true
        }
    })
    const companies = await prismaClient.companies.findMany({
        orderBy: [
            {
                name: 'desc'
            },
        ],
    })
    response.render('prices', {
        prices: prices,
        companies: companies
    })
})

router.get('/prices/new', async (request, response)=> {
    const companies = await prismaClient.companies.findMany({
        orderBy: [
            {
                name: 'desc'
            }
        ]
    })
    const products = await prismaClient.products.findMany({
        orderBy: [
            {
                name: 'desc'
            }
        ]
    })
    response.render('prices/new', {
        companies: companies,
        products: products
    })
})

router.post('/prices/save', async (request, response)=> {
    const company_id = request.body.company_id
    const product_id = request.body.product_id
    const price = parseFloat(request.body.price)

    const exist = await prismaClient.prices.findFirst({
        where: {
            company_id: company_id,
            product_id: product_id
        }
    })

    if(exist == undefined){
        try {
            await prismaClient.prices.create({
                data: {
                    price: price,
                    product_id: product_id,
                    company_id: company_id,
                }
            })
            response.redirect('/prices')
            
        } catch (error) {
            response.redirect('/prices/new')
        }
    } else {
        console.log('Ja existe um preço definido')
        response.redirect('/prices/new')
    }
})

router.post('/prices/delete', async (request, response)=>{
    const id = request.body.id
    await prismaClient.prices.delete({
        where: {
            id: id
        }
    })
    response.redirect('/prices')
})

router.post('/prices/edit/:id', async (request, response)=>{
    const id = request.body.id
    const price = await prismaClient.prices.findUnique({
        where: {
            id: id
        },
        rejectOnNotFound: true
    })
    const companies = await prismaClient.companies.findMany({
        orderBy: [
            {
                name: 'desc'
            }
        ]
    })
    const products = await prismaClient.products.findMany({
        orderBy: [
            {
                name: 'desc'
            }
        ]
    })
    
    response.render('prices/edit', {
        price: price,
        companies: companies,
        products: products
    })
})

router.post('/prices/update', async (request, response)=> {
    const id = request.body.id
    const product_id = request.body.product_id
    const company_id = request.body.company_id
    const price = parseFloat(request.body.price)
    try {
        await prismaClient.prices.update({
            where: {
                id: id
            },
            data: {
                product_id: product_id,
                company_id: company_id,
                price: price
            }
        })
    } catch (e) {
        throw e
    }
    response.redirect('/prices')
})

export default router
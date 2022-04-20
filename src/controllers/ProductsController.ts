import {Router} from 'express'
import prismaClient from '../prisma'

const router =  Router()

router.get('/products', async(request, response)=> {
    const products = await prismaClient.products.findMany({
        orderBy: [
            {
                updatedAt: 'desc'
            }
        ]
    })
    response.render('products', {
        products: products
    })
})

router.get('/products/new', async (request, response)=> {
    response.render('products/new')
})

router.post('/products/save', async (request, response)=> {
    const name = request.body.name
    await prismaClient.products.create({
        data: {
            name: name
        }
    })
    response.redirect('/products')
})

router.post('/products/delete', async (request, response)=>{
    const id = request.body.id
    await prismaClient.products.delete({
        where: {
            id: id
        }
    })
    response.redirect('/products')
})

router.post('/products/edit/:id', async (request, response)=>{
    const id = request.body.id
    const product = await prismaClient.products.findUnique({
        where: {
            id: id
        },
        rejectOnNotFound: true
    })
    
    response.render('products/edit', {
        product: product,
    })
})

router.post('/products/update', async (request, response)=> {
    const id = request.body.id
    const name = request.body.name
    await prismaClient.products.update({
        where: {
            id: id
        },
        data: {
            name: name
        }
    })
    response.redirect('/products')
})

export default router
import {Router} from 'express'
import prismaClient from '../prisma'

const router =  Router()

router.get('/companies', async(request, response)=> {
    const companies = await prismaClient.companies.findMany({
        orderBy: [
            {
                updatedAt: 'desc'
            }
        ]
    })
    response.render('companies', {
        companies: companies
    })
})

router.get('/companies/new', async (request, response)=> {
    response.render('companies/new')
})

router.post('/companies/save', async (request, response)=> {
    const name = request.body.name
    try {
        await prismaClient.companies.create({
            data: {
                name: name
            }
        })
    } catch (e) {
        throw e
    }
    response.redirect('/companies')
})

router.post('/companies/delete', async (request, response)=>{
    const id = request.body.id
    await prismaClient.companies.delete({
        where: {
            id: id
        }
    })
    response.redirect('/companies')
})

router.post('/companies/edit/:id', async (request, response)=>{
    const id = request.body.id
    const company = await prismaClient.companies.findFirst({
        where: {
            id: id
        },
        rejectOnNotFound: true
    })
    
    response.render('companies/edit', {
        company: company,
    })

})

router.post('/companies/update', async (request, response)=> {
    const id = request.body.id
    const name = request.body.name
    try {
        await prismaClient.companies.update({
            where: {
                id: id
            },
            data: {
                name: name
            }
        })  
    } catch (e) {
        throw e
    }
    response.redirect('/companies')
})

export default router
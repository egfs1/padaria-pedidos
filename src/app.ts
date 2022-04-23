import express from 'express'
import router from './router'
import path from 'path'
import bodyParser from 'body-parser'

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../src/views'))
app.use(router)

const port = process.env.PORT || 3000
app.listen(port, ()=> console.log('Server is running on port ' + port + '!'))


//import express
import express from 'express'
import brokerRoutes from './api/routes/brokerRoutes.js'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import BrokerController from './api/controller/brokerController.js'
 
dotenv.config()
const port = process.env.PORT || 5000
const host = process.env.HOST || 'localhost'
const baseUri = process.env.BASEURI || ''
// init express
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())
 
// basic route
app.get('/', (req, res) => {
  res.send('Hello World')
})

brokerRoutes(app)

BrokerController.brokerConsumeServer()
 
// listen on port
app.listen(port, () => console.log('Server Running at http://localhost:'+port))
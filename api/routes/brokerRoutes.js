import express from "express"
import BrokerController from "../controller/brokerController"

const router = express.Router()

export default (app) => {
    app.route('/process').get((request, response) => {
        BrokerController.brokerTest(request, response)
    })
    
    app.route('/produce').post((request, response) => {
        BrokerController.brokerProduce(request, response)
    })
    
    app.route('/consume').post((request, response) => {
        BrokerController.brokerConsume(request, response)
    })
}
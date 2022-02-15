//import express
import express from "express";
import brokerRoutes from "./api/routes/brokerRoutes.js";
import bodyParser from "body-parser";
 
// init express
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
 
// basic route
app.get('/', (req, res) => {
    res.send('Hello World');
});

brokerRoutes(app);
 
// listen on port
app.listen(5000, () => console.log('Server Running at http://localhost:5000'));
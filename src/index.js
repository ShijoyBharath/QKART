const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const userRouter = require('./routes/v1')

let server;

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
// console.log(config)
mongoose.connect(config.mongoose.url)
app.listen(config.port)

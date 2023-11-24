require('dotenv').config()

const app = require('./src/app')

const Port = process.env.Port  ;
app.listen(Port , () => {
    console.log(`server is ready for connections on port ${Port}`)
})
const express = require('express');
const app = express()

const EventR = require('./routers/events')

const port = 3000;

app.use(express.json())
app.use(EventR)

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
})
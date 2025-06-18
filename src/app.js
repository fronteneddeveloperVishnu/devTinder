const express = require('express');
const app = express();

app.use("/hello", (req, res)=>{
    res.send("Welcome to home page")
})

app.use("/test", (req, res)=>{
    res.send("Test Page");
})

app.listen(7777, ()=>{
    console.log("App is listening on port 7777");
})
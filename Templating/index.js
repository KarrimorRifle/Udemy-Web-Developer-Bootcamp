const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/quit', (req,res) =>{
    process.exit();
})
app.get('/',(req,res) =>{
    res.send('hi');
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
});


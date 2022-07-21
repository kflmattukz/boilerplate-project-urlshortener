require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// add url shortener
app.post('/api/shorturl' , function (req,res) {
  
  res.json({ urlshortener : req.body.url })
});

//hit te url shortener using Id from 
app.get('/api/shorturl/:id', function(req , res) {
  res.json({ urlId : req.params.id })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

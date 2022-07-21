require('dotenv').config();
const dns = require('dns');
const fs = require('fs')
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

  const original_url = req.body.url
  const object_url = new URL(original_url)
  let short_url
  dns.lookup(object_url.hostname , function (err, address , family) {
    if (err) {
      return res.json({ 'error': 'invalid url' })
    }
    //make new Shortener ID
    short_url = Math.floor(Math.random() * 100000)
    
    let listUrls = []

    try {
      const data = fs.readFileSync('shortUrl.json', 'utf8');
      const listUrl = JSON.parse(data)
      listUrl.map(url => listUrls.push(url))
    } catch (err) {
      console.error(err);
    }

    // fs.readFile('shortUrl.json', 'utf-8', function(err ,data) {
    //   if (err) {
    //     return console.log(err)
    //   }
    //   const listUrl = JSON.parse(data)
    //   listUrl.map(url => listUrls.push(url))
    // })


    listUrls.push({ original_url: original_url , short_url: short_url })
    console.log(listUrls)
    fs.writeFile('shortUrl.json', JSON.stringify(listUrls, null, 2) , function(err) {
      if (err) {
        return console.log(err)
      }
    } )

    res.json({ 
      'original_url' : original_url,
      'short_url' : short_url 
    })

  })
});

//hit te url shortener using Id from 
app.get('/api/shorturl/:short_url', function(req , res) {
  
  try {
    const data = fs.readFileSync('shortUrl.json', 'utf8');
    const listUrl = JSON.parse(data)
    listUrl.map(url => {
      if (url.short_url.toString() === req.params.short_url) {
        res.redirect(url.original_url)
      }
    })
  } catch (err) {
    console.error(err);
  }

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

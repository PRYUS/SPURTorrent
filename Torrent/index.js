const fs = require('fs');
const bencode = require('bencode');
const splitFile = require('split-file');
const bodyParser = require('body-parser');
const express = require('express');
var name = [];
var torrent = {};
splitFile.splitFileBySize(__dirname + '/vids/vid.mp4', 1024*1024)
    .then((names) => {
        console.log(names);
        for (i in names) {
            torrent[i] = names[i];
        }
        fs.writeFileSync('vid.mp4.torrent', JSON.stringify(torrent));
        name = names;
    })
    .catch((err) => {
        console.log('Error: ', err);
    });
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/file', (req, res) => {
    console.log(req.query.data);
    if (req.query.data) {
        res.sendFile(req.query.data);
    }
})
app.listen(3000, () => console.log('Server started at port 3000'));
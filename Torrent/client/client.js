var http = require('http');
var fs = require('fs');
const splitFile = require('split-file');
var names = [];
var torrent = JSON.parse(fs.readFileSync('vid.mp4.torrent'));
var files = JSON.parse(fs.readFileSync('vid.mp4.partfile'));
var over = (names, torrent) => {
    var name = [];
    for (i of Object.keys(torrent)) {
        var t = torrent[i].split('/');
        name.push(t[t.length - 1]);
    }
    splitFile.mergeFiles(name, __dirname + '/vid.mp4')
        .then(() => {
            console.log('Done!');
            for (i of Object.keys(torrent)) {
                var t = torrent[i].split('/');
                var t = t[t.length - 1];
                fs.unlink(t, function (err) {
                    if (err) return console.log(err);
                    // console.log('file deleted successfully');
                });
            }
        })
        .catch((err) => {
            console.log('Error: ', err);
        });
}
var download  = (t,i, torrent) => {
    var request = http.get("http://192.168.43.62:3000/file?data=" + torrent[i], function (response) {
        response.pipe(fs.createWriteStream(t[t.length - 1]).on('finish', function () {
            var arr = JSON.parse(fs.readFileSync('vid.mp4.partfile'));
            arr.push(i);
            fs.writeFileSync('vid.mp4.partfile', JSON.stringify(arr));
            count++;
            console.log(count, Object.keys(torrent).length);
            if (count === Object.keys(torrent).length) over(names, torrent);
        }));
    });
}
var count = files.length;
for (i of Object.keys(torrent)) {
    var t = torrent[i].split('/');
    names.push(t[t.length - 1]);
    if (! files.includes(i)) download(t, i, torrent);
}

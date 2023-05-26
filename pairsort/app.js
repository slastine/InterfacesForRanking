const express = require('express')
const app = express()
const port = 3000

const fs = require('fs');
var multer = require('multer');
var upload = multer();
var crypto = require('crypto');

let users = [];

var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
var upload = multer();
app.use(upload.array());
const path = require('path');

app.get('/pairSort', (req, res) => {
    app.use(express.static('public'));
    app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
    res.sendFile('/pairSort.html', { root: './public/images' });
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.get("/createkey", (req, res) => {

    var id = crypto.randomBytes(20).toString('hex');
    users.push({ "id": id, "choices": []});
    res.send(id);
});

app.post("/getSummary", (req, res) => {

    let data = fs.readFileSync('./summaries.json',
        { encoding: 'utf8', flag: 'r' });
    data = JSON.parse(data)[req.body.fileNum]
    let returnValue = Object.values(data)[req.body.sumNum]
    console.log(req.body.sumNum)
    res.send(returnValue)
});

app.post("/getSummaries", (req, res) => {

    let data = fs.readFileSync('./summaries.json',
        { encoding: 'utf8', flag: 'r' });
    data = JSON.parse(data)[req.body.fileNum]
    let returnValue = Object.values(data)
    let d = []
    let count = 0
    for (v of returnValue) 
{
    
    if(count > 0) d.push({"sumNum": count, "sum": v})
    count++
}
    res.send(d)
});


app.post("/getArticle", (req, res) => {

    let data = fs.readFileSync('./summaries.json',
        { encoding: 'utf8', flag: 'r' });
    data = JSON.parse(data)[req.body.fileNum]
    let returnValue = Object.values(data)[0]
    res.send(returnValue)
});

app.get("/debug", (req, res) => {

    res.send(JSON.stringify(users))

});

app.post("/setValue", (req, res) => {
    var thisUser = users.find(x => x.id == req.query.id);
    thisUser.choices.push({ "fileNum": req.body.fileNum, "sumNum": req.body.sumNum, "value": req.body.value })
    console.log(thisUser)
    users.find(x => x.id == req.query.id).choices = thisUser.choices
    res.send("*")
});

app.post("/getSets", (req, res) => {
    var thisUser = users.find(x => x.id == req.query.id);
    let sets = []
    sets.push({ "Value": "Bad", "Summaries": thisUser.choices.filter(x => x.value == -1) })
    sets.push({ "Value": "Average", "Summaries": thisUser.choices.filter(x => x.value == 0) })
    sets.push({ "Value": "Good", "Summaries": thisUser.choices.filter(x => x.value == 1) })
    res.send(sets)
});

app.post("/data", (req, res) => {
    var thisUser = users.find(x => x.id == req.query.id);
    let name = req.query.id
    fs.mkdirSync(path.join(__dirname, "/Users/" + name));
    fs.writeFileSync("./Users/" + name + "/log.txt", req.body.data)
res.send(".")
});



app.post("/bias", async (req, res) => {
    bias.bias(req.body.fileNum).then((value) => { res.send(value) });
});


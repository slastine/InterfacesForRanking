const express = require('express')
const app = express()
const port = 3000

const fs = require('fs');
var multer = require('multer');
var upload = multer();
var crypto = require('crypto');
var csv = require('csv-parse');

let users = [];

let adminKey;

var bodyParser = require('body-parser')

let protocolCount = 6

let foldCount = 6

let articleCount = 80

let allSummaries = []

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
var upload = multer();
app.use(upload.array());
const path = require('path');

const mysql = require("mysql")
const db = mysql.createPool({
   connectionLimit: 100,
   host: "XXX",       //This is your localhost IP
   user: "XXX",         // "newuser" created in Step 1(e)
   password: "XXX",  // password for the new user
   database: "XXX",      // Database name
   port: "XXX"             // port name, "3306" by default
})
db.getConnection( (err, connection)=> {
   if (err) throw (err)
   console.log ("DB connected successful: " + connection.threadId)
})

app.get('/', (req, res) => {
    app.use(express.static('public'));
    app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
    res.sendFile('/login.html', { root: './admin' });
    
})


app.get('/login', (req, res) => {
    app.use(express.static('public'));
    app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
    res.sendFile('/login.html', { root: './admin' });
})

app.post('/login', (req, res) => {
    
    db.query("SELECT * FROM UserData WHERE user = '" + req.body.user + "' AND pass = '" + req.body.pass +"';", function (err, result) {
        if (err) throw err;
        adminKey = crypto.randomBytes(20).toString('hex');
        if (result[0] != null) {
            if (result[0].admin == 1) res.send({ "admin": true, "key": adminKey })
        else
        {
            let key = result[0].ID;
            res.send({ "admin": false, "key": key })
        }
        }
  });
})

app.get('/admin', (req, res) => {
    if (req.query.id == adminKey) {
        app.use(express.static('public'));
        app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
        res.sendFile('/adminPage.html', { root: './admin' });
    }
    else
    {
        res.send("Access denied")
    }
})

app.get('/dashboard', (req, res) => {
        app.use(express.static('public'));
        app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
        res.sendFile('/dashboard.html', { root: './public/images' });
    
})

app.post('/createUser', (req, res) => {
    if (req.query.id == adminKey) {
        let id = crypto.randomInt(2147483647)
        var sql = "INSERT INTO UserData (ID, user, pass, admin) VALUES ('" + id   + "', '" + req.body.user + "', '" + req.body.pass + "', '0')";
        console.log(sql)
        db.query(sql, function (err, result) {
            if (err) throw err;
        });
        
        let savedFold
        let savedProtocol
        if (req.body.type == "SS") {
            let data = fs.readFileSync('./tracker.json',
                { encoding: 'utf8', flag: 'r' });
            data = JSON.parse(data);
            if (data.lastProtocol > protocolCount) {
                data.lastProtocol = 1;
            }
            if (data.lastFold > foldCount) {
                data.lastFold = 1;
            }
            savedProtocol = data.lastProtocol
            savedFold = data.lastFold
            var sql2 = "INSERT INTO SS_Protocol (ID, Protocol, Fold) VALUES ('" + id + "', '" + req.body.protocol + "', '" + req.body.fold + "')";
            db.query(sql2, function (err, result) {
                if (err) throw err;
            });
            data.lastProtocol++;
            if (data.lastProtocol > protocolCount) {
                data.lastProtocol = 1;
            }
            data.lastFold++;
            if (data.lastFold > foldCount) {
                data.lastFold = 1;
            }
            fs.writeFileSync('./tracker.json', JSON.stringify(data))
            let completion = []
            let articles = getArticlesForFold(req.body.fold)
            for (let i = 0; i < articles.length; i++) {
                console.log(articles[i])
                completion.push({ "article": articles[i], "completion": 0 })
            }
            let method
            if (req.body.protocol == 1) {
                method = ("pairSort")
            }
            else if (req.body.protocol == 2) {
                method = ("mergeRank")
            }
            else if (req.body.protocol == 3) {
                method = ("insertRank")
            }
            else if (req.body.protocol == 4) {
                method = ("elimSort")
            }
            else if (req.body.protocol == 5) {
                method = ("dragSort")
            }
            else {
                method = "likert"
            }
            fs.mkdirSync("./Users/" + method + "/" + id);
            var sqlCompletion = "INSERT INTO Completion (ID, Completion) VALUES ('" + id + "', '" + JSON.stringify(completion) + "')"
            db.query(sqlCompletion, function (err, result) {
                if (err) throw err;
            });
        }
        else if (req.body.type == "S")
        {
            let data = fs.readFileSync('./tracker2.json',
                { encoding: 'utf8', flag: 'r' });
            data = JSON.parse(data);
            let plusOne = data.lastProtocol + 1
            if (data.lastProtocol > protocolCount) {
                data.lastProtocol = 1;
            }
            if (data.lastProtocol + 1 > protocolCount) {
                plusOne = 1;
            }
            if (data.lastFold > foldCount) {
                data.lastFold = 1;
            }
            var sql2 = "INSERT INTO S_Protocol (ID, Protocol, Protocol2, Fold) VALUES ('" + id + "', '" + data.lastProtocol + "', '" +plusOne + "', '" + data.lastFold  + "')";
            console.log(sql2);
            db.query(sql2, function (err, result) {
                if (err) throw err;
            });
            data.lastProtocol++;
            if (data.lastProtocol > protocolCount) {
                data.lastProtocol = 1;
            }
            data.lastProtocol++;
            if (data.lastProtocol > protocolCount) {
                data.lastProtocol = 1;
            }
            data.lastFold++;
            if (data.lastFold > foldCount) {
                data.lastFold = 1;
            }
            fs.writeFileSync('./tracker2.json', JSON.stringify(data))
            let completion = []
            let articles = getArticlesForFold(data.lastFold - 1);
            console.log(articles)
            for (let i = 0; i < articles.length; i++) {
                completion.push({ "article": articles[i].doc_id, "completion": 0 })
            }
            let method
            if (data.lastProtocol - 1 == 1) {
                method = ("pairSort")
            }
            else if (data.lastProtocol - 1 == 2) {
                method = ("mergeRank")
            }
            else if (data.lastProtocol - 1 == 3) {
                method = ("insertRank")
            }
            else if (data.lastProtocol - 1 == 4) {
                method = ("elimSort")
            }
            else if (data.lastProtocol - 1 == 5) {
                method = ("dragSort")
            }
            fs.mkdirSync("./Users/" + method + "/" + id);
            var sqlCompletion = "INSERT INTO Completion (ID, Completion) VALUES ('" + id + "', '" + JSON.stringify(completion) + "')"
            db.query(sqlCompletion, function (err, result) {
                if (err) throw err;

            });
        }
        res.send("User created")
    }
    else {
        res.send("Access denied")
    }
})

app.get('/mergeRank', (req, res) => {
    app.use(express.static('public'));
    app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
    res.sendFile('/mergeRank.html', { root: './public/images' });
})

app.get('/pairSort', (req, res) => {
    app.use(express.static('public'));
    app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
    res.sendFile('/pairSort.html', { root: './public/images' });
})


app.get('/insertRank', (req, res) => {
    app.use(express.static('public'));
    app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
    res.sendFile('/insertRank.html', { root: './public/images' });
})

app.get('/elimSort', (req, res) => {
  app.use(express.static('public'));
    app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
    res.sendFile('/EliminationSort.html', { root: './public/images' });})

app.get('/dragSort', (req, res) => {
  app.use(express.static('public'));
    app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
    res.sendFile('/dragSort.html', { root: './public/images' });
})

app.get('/likert', (req, res) => {
    app.use(express.static('public'));
    app.use('/javascripts', express.static(__dirname + 'public/javascripts'));
    res.sendFile('/likert.html', { root: './public/images' });
})


app.post("/getSummaries", async (req, res) => {

    let data = await getArticleByID(req.query.article)
    let returnValue = Object.values(data)
    let d = []
returnValue.shift()
    let count = 0
    for (v of returnValue) 
{
    
    d.push({"sumNum": count, "sum": v})
    count++
}
    res.send(d)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.get("/createkey", (req, res) => {

    var id = crypto.randomBytes(20).toString('hex');
    users.push({ "id": id, "choices": []});
    res.send(id);
});


app.post("/getSummary", (req, res) => {

    let data = getArticleByID(req.query.article)
    let returnValue = Object.values(data)[req.body.sumNum]
    res.send(returnValue)
});

app.post("/getArticle", (req, res) => {

    getArticleByID(req.query.article).then((data) => {
        let returnValue = Object.values(data)[1]
        res.send(returnValue) }); 
    
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

app.post("/getSummaries", (req, res) => {

    let returnValue = getArticleByID(req.query.article)
    for (v of returnValue) 
{
    
    if(count > 1) d.push({"sumNum": count, "sum": v})
    count++
}
    res.send(d)
});

app.post("/getTasks", (req, res) => {

    let sql = "SELECT * FROM Completion WHERE ID=" + req.query.id;
    console.log(sql)
    db.query(sql, function (err, result) {
        res.send(result[0].Completion)
    });
});

app.post("/getMethod", (req, res) => {

    let sql = "SELECT * FROM SS_Protocol WHERE ID=" + req.query.id;
    db.query(sql, function (err, result) {
        console.log("Protocol")
        console.log(result[0].Protocol)
        if (result[0].Protocol == 1) {
            res.send("pairsort")
        }
        else if (result[0].Protocol == 2)
        {
            res.send("mergerank")
        }
        else if (result[0].Protocol == 3) {
            res.send("insertrank")
        }
        else if (result[0].Protocol == 4) {
            res.send("elimsort")
        }
        else if (result[0].Protocol == 5) {
            res.send("dragsort")
        }
        else res.send("likert")
    });
});

async function getArticleByID(id)
{
    return new Promise((resolve, reject) => {

        fs.readFile('./fullSummaries.json', 'utf-8', (err, data) => {
            data = JSON.parse(data);

            for (x of data) {
                let newX = x.doc_id.replace("\ufeff", "");
                if (newX == id) resolve(x)
            }
            resolve("Could not find article")
        });
    });
    
}


function getArticlesForFold(foldNum)
{
    var obj = fs.readFileSync('./Docs/' + foldNum +'.json', 'utf8');
    let list = obj.split(",")
    let newList = []
    for (x of list)
    {
        newList.push(x.replace("\ufeff", ""))
    }
    return newList
}

app.post("/data", (req, res) => {
    var thisUser = users.find(x => x.id == req.query.id);
    let name = req.query.id
    
    let id = req.query.article
    fs.writeFileSync("./Users/" + req.body.method + "/" + name +"/" + id +".txt", req.body.data)
    let sql = "SELECT * FROM Completion WHERE ID=" + req.query.id;
    console.log(sql)
    db.query(sql, function (err, result) {
        console.log(err)
 if (err) throw err;

console.log("*")
        console.log(result)
        let completion = JSON.parse(result[0].Completion)
        console.log(completion)
        for (x of completion)
        {
            console.log(x.article)
            console.log(id)
            if (x.article == id)
            {
                console.log("SAME")
                x.completion = 1
            }
        }
        let sql2 = "UPDATE Completion SET Completion = '" + JSON.stringify(completion) + "'WHERE ID=" + req.query.id;
        console.log(sql2)
        db.query(sql2, function (err, result) {

            res.send("*")
        });
    });
    


});



app.post("/bias", async (req, res) => {
    bias.bias(req.body.fileNum).then((value) => { res.send(value) });
});


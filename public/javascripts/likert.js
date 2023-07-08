let key;
let allData;
let fileNum = 1;
let article 
let ids = false;
let firstSum
let secondSum
let timeStarted
let timeStopped
let next
let result = []
async function setup()
{
timeStarted = Date.now()
    const urlParams = new URLSearchParams(window.location.search);
    key  = urlParams.get("id")
    article = urlParams.get("article")    
    let formData = new FormData()
    formData.append("fileNum", fileNum)
    fetch('http://54.204.160.91/getArticle?id=' + key + "&article=" + article, {
        method: "post", body: formData
    }).then((response) => response.text()).then((data) => { document.getElementById("article").innerHTML = data; });
   
    fetch('http://54.204.160.91/getSummaries?id=' + key + "&article=" + article, {
        method: "post", body: formData

    }).then((response) => response.text()).then(async function (data)
    {
        console.log(data)
        data = JSON.parse(data);
data.shift()
        for (var i = 0; i < data.length; i++) {

            await rate(data[i].sumNum - 1, data).then((value) => result.push({"sumNum": data[i].sumNum, "value": value}))
        }
        submit(data)
        });
           
            
    

}



function swap()
{
    console.log("Swap")
    ids = !ids
    if (!ids) {
        document.getElementById("firstSum").innerHTML = firstSum.sum;

        document.getElementById("secondSum").innerHTML = secondSum.sum;
    }
    else {
        document.getElementById("firstSum").innerHTML = firstSum.sumNum;

        document.getElementById("secondSum").innerHTML = secondSum.sumNum;
    }
}

async function rate(first, set)
{
    return new Promise(resolve => {
        if (!ids) {
            document.getElementById("firstSum").innerHTML = set[first].sum;

            
        }
        else
        {
            document.getElementById("firstSum").innerHTML = set[first].sumNum;

            
        }
        
        let nextClick = function () {
            document.getElementById("next")
                .removeEventListener("click", nextClick);
            resolve(getRadio());
            resetRadio()
        }
        document.getElementById("next")
            .addEventListener("click", nextClick)

    })
}

function getRadio() {
    let radioButtons = document.getElementsByName('rate');
    let currentMax = 0
    for (let radio of radioButtons) {
        if (radio.checked) {
            if (radio.value > currentMax) currentMax = radio.value
        }
    }
    console.log(currentMax + " stars")
    return currentMax
}

function resetRadio()
{
    let radioButtons = document.getElementsByName('rate');
    for (let radio of radioButtons) {
        if (radio.checked) {
            radio.checked = false
        }
    }
}


function submit(data)
{
    timeStopped = Date.now()
data.push({"timeStarted": timeStarted})
data.push({"timeStopped": timeStopped})

    let formData = new FormData()
    formData.append("data", JSON.stringify(result))
 formData.append("method", "likert")
    fetch('http://54.204.160.91/data?id=' + key + "&article=" + article, {
        method: "post",
        body: formData

    }).then((value) => {window.location.href = "http://54.204.160.91/dashboard?id=" + key });
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

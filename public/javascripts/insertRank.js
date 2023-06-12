let key;
let article
let allData;
let fileNum = 1;
let ids
let firstSum
let secondSum
let timeStarted
let timeStopped
async function setup()
{
timeStarted = Date.now()
    const urlParams = new URLSearchParams(window.location.search);
    key = urlParams.get("id")
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
        let i, key, j;
data.shift()
        let n = data.length
        for (i = 1; i < n; i++) {
            key = data[i];
            j = i - 1;
           firstSum = data[j]
           secondSum = data[i]
            while (j >= 0 && await compare(j, i, fileNum, data)) {
                data[j + 1] = data[j];
                j = j - 1;
            }
            data[j + 1] = key;
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

async function compare(first, second, fileNum, set)
{
    console.log("Comparing " + set[first].sumNum+ " <b>with</b> " + set[second].sumNum)
    return new Promise(resolve => {
        if (!ids) {
            document.getElementById("firstSum").innerHTML = set[first].sum;

            document.getElementById("secondSum").innerHTML = set[second].sum;
        }
        else
        {
            document.getElementById("firstSum").innerHTML = set[first].sumNum;

            document.getElementById("secondSum").innerHTML = set[second].sumNum;
        }

        let firstSumClick = function () {
            document.getElementById("firstSum")
                .removeEventListener("click", firstSumClick);
            resolve(false);
        }
        document.getElementById("firstSum")
            .addEventListener("click", firstSumClick)
        let secondSumClick = function () {
            document.getElementById("secondSum")
                .removeEventListener("click", secondSumClick);
            resolve(true);
        }
        document.getElementById("secondSum")
            .addEventListener("click", secondSumClick)
    })
}


function submit(data)
{
    timeStopped = Date.now()
    let formData = new FormData()
data.push({"timeStarted": timeStarted})
data.push({"timeStopped": timeStopped})
    formData.append("data", JSON.stringify(data))
 formData.append("method", "insertRank")
    fetch('http://54.204.160.91/data?id=' + key + "&article=" + article, {
        method: "post",
        body: formData

    }).then((value) => { window.location.href = "http://54.204.160.91/dashboard?id=" + key });
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

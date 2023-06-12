let key;
let article;
let summaries
let fileNum = 1;
let items = []
let ids = false
let timeStarted 
let timeStopped
async function setup() {
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

    }).then((response) => response.text()).then(async function (data) {

        console.log(data)
        data = JSON.parse(data);
data.shift()
        summaries = data
        for (sum of data) {
            let item = document.createElement("div");
            item.id = ("name", "{'sumNum':" + sum.sumNum + "}");
            item.className = "item";
            item.innerHTML = sum.sum;
            items.push(item)
            list1.appendChild(item);
        }

    });

}

function swap()
{
    ids = !ids
    if (ids) {
        let count = 0
        for (sum of summaries) {
            items[count].innerHTML = sum.sumNum;
            items[count].style.width = "100%"
            items[count].style.textAlign = "center"
            count++
        }
    }
    else {
        let count = 0
        for (sum of summaries) {
            items[count].innerHTML = sum.sum;
            items[count].style.width = "100%"
            items[count].style.textAlign = "left"
            count++
        }
    }
}


function submit()
{
    let list1 = document.getElementById("list1");
timeStopped = Date.now()
    let total = ""
    for (element of list1.children)
    {
        total += (element.id) + "\n"
    }
total += "\n" + "timeStarted:" + timeStarted + " timeStopped:" + timeStopped;
    let formData = new FormData()
    formData.append("data", total)
 formData.append("method", "dragSort")
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

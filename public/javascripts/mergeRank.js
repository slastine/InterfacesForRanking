let key;
let fileNum = 1;
let id
let ids = false
let items = []
let summaries
let ranked = []
let goodSet = []
let badSet = []
let goodRanked = false
let badRanked = false
let timeStarted
let timeStopped
function swap()
{

    ids = !ids
    if (ids) {
        let count = 0
        for (item of items) {
            item.innerHTML = JSON.parse(item.id).sumNum
            item.style.width = "100%"
            item.style.textAlign = "center"
        }
    }
    else {
        let count = 0
        for (item of items) {


            item.innerHTML = summaries[JSON.parse(item.id).sumNum].sum
            item.style.width = "100%"
            item.style.textAlign = "left"

        }
    }

}

function setup()
{
    const urlParams = new URLSearchParams(window.location.search);
    key = urlParams.get('article');
 timeStarted = Date.now()
    let list1 = document.getElementById("list1");
    let list2 = document.getElementById("list2");
 let formData = new FormData()
            formData.append("fileNum",fileNum)
fetch('http://54.204.160.91/getArticle?article=' + key, {
        method: "post", body: formData
    }).then((response) => response.text()).then((data) => { document.getElementById("article").innerHTML = data; });

    fetch('http://54.204.160.91/getSummaries?article=' + key, {
        method: "post",
        body: formData

    }).then((response) => response.text()).then((data) => {
        let sets = JSON.parse(data);
sets.shift()
        summaries = sets
        mergeSort(sets).then((response) => submit(response.flat(10)))
        
    }).then(() =>
    {
        let all = []
        for (element of list1.children) {
            all.push(JSON.parse(element.id))
        }
        
        
        
    });
}

function split(arr, size, start = 1)
{
    let first = []
    let second = []
    for (let i = start; i < size; i++)
    {
        first.push(arr[i])
    }
    for (let i = size; i < arr.length; i++)
    {
        second.push(arr[i])
    }
    return {"first": first, "second": second}
}

async function mergeSort(arr) {
    // Base case

    return new Promise(async function (resolve) {
        if (arr.length <= 1) { resolve(arr); }
        else await reduce(arr).then(async (value) => {
            let left = await mergeSort(value.good)
            let right = await mergeSort(value.bad)
            
            
            let toReturn = []
            toReturn.push(left)
            toReturn.push(right)

            resolve(toReturn)

        });
    });
    

}


const timeout = async ms => new Promise(res => setTimeout(res, ms));
let next = false; // this is to be changed on user input

async function waitUserInput() {
    while (next === false) await timeout(50); // pauses script
    next = false; // reset var
}

function activate() {
    next = true;
}

function reset(arr)
{
    let s = split(arr, Math.floor(arr.length / 2), 0)
    let good = s.first
    let bad = s.second    
while (list2.firstElementChild) {
            list2.removeChild(list2.firstElementChild);
        }

    for (set of bad) {
        let item = document.createElement("div");
        item.id = ("name", '{"sumNum":' + set.sumNum + "}");
        item.className = "item";
        let formData = new FormData()
        formData.append("fileNum", fileNum)
        formData.append("sumNum", set.sumNum)
        let data = summaries[set.sumNum - 1].sum
            if (!ids) {
                item.innerHTML = data;
                item.style.width = "100%"
                item.style.textAlign = "left"
            }
            else {
                item.innerHTML = JSON.parse(item.id).sumNum
                item.style.width = "100%"
                item.style.textAlign = "center"
            }
            list2.appendChild(item);
            items.push(item)
    }
while (list1.firstElementChild) {
            list1.removeChild(list1.firstElementChild);
        }

    for (set of good) {
        let item = document.createElement("div");
        item.id = ("name", '{"sumNum":' + set.sumNum + "}");
        item.className = "item";
        let formData = new FormData()
        formData.append("fileNum", fileNum)
        formData.append("sumNum", set.sumNum)

        let data = summaries[set.sumNum - 1].sum
            if (!ids) {
                item.innerHTML = data;
                item.style.width = "100%"
                item.style.textAlign = "left"
            }
            else {
                item.innerHTML = JSON.parse(item.id).sumNum
                item.style.width = "100%"
                item.style.textAlign = "center"
            }

            list1.appendChild(item);
            items.push(item)
    }
}

async function reduce(arr)
{
await reset(arr)
    return new Promise(async function (resolve, reject) {

    

    await waitUserInput().then(async () =>
    {
        let list1 = document.getElementById("list1");
        let list2 = document.getElementById("list2");
        let good = []
        let bad = []
        while (list1.firstElementChild) {
            good.push(JSON.parse(list1.firstElementChild.id))
            list1.removeChild(list1.firstElementChild);
        }
        while (list2.firstElementChild) {
            bad.push(JSON.parse(list2.firstElementChild.id))
            list2.removeChild(list2.firstElementChild);
        }
        resolve({ "good": good, "bad": bad })
        
    });
    });

}

function submit(arr)
{
 timeStopped = Date.now()
    
        let formData = new FormData()
arr.push({"timeStarted": timeStarted})
arr.push({"timeStopped": timeStopped})

        formData.append("data", JSON.stringify(arr))
        const urlParams = new URLSearchParams(window.location.search);

        formData.append("method", "mergeRank")
        fetch('http://54.204.160.91/data?id=' + urlParams.get('id') + "&article=" + key, {
            method: "post",
            body: formData

        }).then((response) => { window.location.href = "http://54.204.160.91/dashboard?id=" + urlParams.get('id') });
    
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

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
        console.log(sets)
        summaries = sets
        let s = split(sets, Math.floor(sets.length / 2))
        console.log(s)
        let good = s.first
        let bad = s.second
        read = JSON.parse(data)
        for (set of good) {
            let formData = new FormData()
            formData.append("fileNum", fileNum)
            formData.append("sumNum", set.sumNum)
            let item = document.createElement("div");
            item.id = ("name", '{"sumNum":' + set.sumNum + "}");
            item.className = "item";
            fetch('http://54.204.160.91/getSummary?article=' + key, {
                method: "post",
                body: formData

            }).then((response) => response.text()).then((data) => {
                if (!ids) item.innerHTML = data;
                else item.innerHTML = set.sumNum

                list1.appendChild(item);
                items.push(item)
            });

        }
        for (set of bad) {
            let item = document.createElement("div");
            item.id = ("name", '{"sumNum":' + set.sumNum + "}");
            item.className = "item";
            let formData = new FormData()
            formData.append("fileNum", fileNum)
            formData.append("sumNum", set.sumNum)
            fetch('http://54.204.160.91/getSummary?article=' + key, {
                method: "post",
                body: formData

            }).then((response) => response.text()).then((data) => {
                if (!ids) item.innerHTML = data;
                else item.innerHTML = set.sumNum

                list2.appendChild(item);
                items.push(item)
            });
        }
        mergeSort(good.concat(bad)).then((response) => console.log(response.flat(10)))
        
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
    for (let i = size + 1; i < arr.length; i++)
    {
        second.push(arr[i])
    }
    return {"first": first, "second": second}
}

async function mergeSort(arr) {
    // Base case
    return new Promise(async function (resolve) {
        if (arr.length <= 1) resolve(arr)
        else await reduce(arr).then(async (value) => {
            let left = mergeSort(value.good)
            left.then((response) => console.log(response));
            let right = mergeSort(value.bad)
            right.then((response) => console.log(response));
            left.then((response) => { left = response }).then(() => right).then((response) => right = response).then(() => {

                    let toReturn = []
                    toReturn.push(left.flat(10))
                    toReturn.push(right.flat(10))
                    
                console.log(toReturn.flat(10))
                resolve(toReturn.flat(10))
                
            });

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
    console.log(good)
    console.log("Vs")
    console.log(bad)
    
    for (set of bad) {
        let item = document.createElement("div");
        item.id = ("name", '{"sumNum":' + set.sumNum + "}");
        item.className = "item";
        let formData = new FormData()
        formData.append("fileNum", fileNum)
        formData.append("sumNum", set.sumNum)
        fetch('http://54.204.160.91/getSummary?article=' + key, {
            method: "post",
            body: formData

        }).then((response) => response.text()).then((data) => {
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
        });
    }
    for (set of good) {
        let item = document.createElement("div");
        item.id = ("name", '{"sumNum":' + set.sumNum + "}");
        item.className = "item";
        let formData = new FormData()
        formData.append("fileNum", fileNum)
        formData.append("sumNum", set.sumNum)
        fetch('http://54.204.160.91/getSummary?article=' + key, {
            method: "post",
            body: formData

        }).then((response) => response.text()).then((data) => {
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
        });
    }
}

async function reduce(arr)
{
    return new Promise(async function (resolve, reject) {

        
    
    let list1 = document.getElementById("list1");
    let list2 = document.getElementById("list2");

    

    await waitUserInput().then(async () =>
    {
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
        reset(arr)
    });
    });

}

function submit()
{
 
    if (ranked.length == 17) {
        let total = ""
        for (element of list1.children) {
            total += (element.id) + "\n"
        }
        for (element of list2.children) {
            total += (element.id) + "\n"
        }
        for (element of ranked) {
            total += (element.id) + "\n"
        }

        let formData = new FormData()
        formData.append("data", total)
        const urlParams = new URLSearchParams(window.location.search);

        formData.append("method", "mergeRank")
        fetch('http://54.204.160.91/data?id=' + urlParams.get('id') + "&article=" + key, {
            method: "post",
            body: formData

        }).then((response) => { window.location.href = "http://54.204.160.91/dashboard?id=" + urlParams.get('id') });
    }
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

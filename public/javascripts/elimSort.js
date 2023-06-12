let currentSelected = []
let currentItems = []
let allSummaries = []
let fileNum = 1;
let survivors = []
let eliminated = []
let batchMax = 4
let sumNums = []
let ranked = []
let key
let article
let first
let second
let third
let fourth
let ids = false
let timeStarted
let timeStopped
function picked(itemId)
{
    itemId = itemId.id
    
    if (currentSelected.some(e => e.id === itemId)) {
        currentSelected = currentSelected.filter(e => e.id !== itemId)
        document.getElementById(itemId).style.backgroundColor = "lightgray";
        switch (itemId) {
            case "one":
                currentItems = currentItems.filter(e => e.sum !== sumNums[0])
                sumNums[0] = null;
                break;
            case "two":
                currentItems = currentItems.filter(e => e.sum !== sumNums[1])
                sumNums[1] = null;
                break;
            case "three":
                currentItems = currentItems.filter(e => e.sum !== sumNums[2])
                sumNums[2] = null;
                break;
            case "four":
                currentItems = currentItems.filter(e => e.sum !== sumNums[3])
                sumNums[3] = null;
                break;
        }
    }
    else
    {
        currentSelected.push({ "id": itemId, "eliminatedBy": [], "eliminated": [] });
        document.getElementById(itemId).style.backgroundColor = "darkgray";
        switch (itemId) {
            case "one":
                currentItems.push({ "sum": sumNums[0].sum, "eliminatedBy": []})
                break;
            case "two":
                currentItems.push({ "sum": sumNums[1].sum, "eliminatedBy": [] })
                break;
            case "three":
                currentItems.push({ "sum": sumNums[2].sum, "eliminatedBy": [] })
                break;
            case "four":
                currentItems.push({ "sum": sumNums[3].sum, "eliminatedBy": [] })
                break;
        }
    }
}

function swap()
{
    ids = !ids
    if (ids) {
        document.getElementById("one").innerHTML = findIndexInAll(first);
        document.getElementById("two").innerHTML = findIndexInAll(second);
        if (third != null) document.getElementById("three").innerHTML = findIndexInAll(third);
        if (fourth != null) document.getElementById("four").innerHTML = findIndexInAll(fourth);
        document.getElementById("one").style.textAlign = "center";
        document.getElementById("two").style.textAlign = "center";
        document.getElementById("three").style.textAlign = "center";
        document.getElementById("four").style.textAlign = "center";

    }
    else {
        document.getElementById("one").innerHTML = first.sum;
        document.getElementById("two").innerHTML = second.sum;
        if (third != null) document.getElementById("three").innerHTML = third.sum;
        if (fourth != null) document.getElementById("four").innerHTML = fourth.sum;
        document.getElementById("one").style.textAlign = "left";
        document.getElementById("two").style.textAlign = "left";
        document.getElementById("three").style.textAlign = "left";
        document.getElementById("four").style.textAlign = "left";
    }
}

function firstBatch()
{

    allSummaries = shuffle(allSummaries);
    let current = allSummaries.slice(0, batchMax);
    for (x in current)
    {
        let temp = current[x]
        current[x] = { "sum": temp, "eliminatedBy": [] }
    }
    if (ids) document.getElementById("one").innerHTML = findIndexInAll(current[0])
    else { document.getElementById("one").innerHTML = current[0].sum }
    sumNums[0] = current[0]
    first = sumNums[0]
    if (ids) document.getElementById("two").innerHTML = findIndexInAll(current[1])
    else { document.getElementById("two").innerHTML = current[1].sum }
    sumNums[1] = current[1]
    second = sumNums[1]
    if (ids) document.getElementById("three").innerHTML = findIndexInAll(current[2])
    else { document.getElementById("three").innerHTML = current[2].sum }
    sumNums[2] = current[2]
    third = sumNums[2]
    if (ids) document.getElementById("four").innerHTML = findIndexInAll(current[3])
    else { document.getElementById("four").innerHTML = current[3].sum }
    sumNums[3] = current[3]
    fourth = sumNums[3]
    for (x in allSummaries) {
        survivors[x] = { "sum": allSummaries[x], "eliminatedBy": [] }
    }
}

function removeFromEliminated(item)
{
    for (x of eliminated)
    {
        if (x.eliminatedBy.some(e => e.sum === item.sum))
        {
            survivors.push({ "sum": x.sum, "eliminatedBy": x.el })
            eliminated.splice(eliminated.indexOf(x), 1)
        }
    }
    let u  = survivors.filter(function (item, pos) {
        return survivors.indexOf(item) == pos;
    })
    survivors = u
    console.log("Survivors")
    console.log(survivors)
    console.log("Eliminated")
    console.log(eliminated)
}

function addToTop(item)
{
    ranked.push(item);
    if (ranked.length < 13) {
        console.log("Ranked")
        console.log(ranked)
        removeFromEliminated(item);
        return true
    }
    else
    {
        console.log("Finished")
        console.log(ranked)
        return false
    }
    
}
function getBatchSize()
{
    return Math.max(2, 2 || 2, 4 || 20, Math.ceil(survivors.length / 5));
}

function nextBatch()
{
    if (survivors.length === 1) {
        if (addToTop(survivors.pop())) {
            nextBatch()
        }
        else
        {
            sendIn()
        }
        return
    }
    else if(survivors.length === 0) 
{
    survivors = eliminated
nextBatch()
}
    else
    {
        shuffle(survivors);
        let batchSize = getBatchSize();
        let evaluating = survivors.slice(0, batchSize);
        if (evaluating.length < 4) {
            document.getElementById("four").disabled = true;
            fourth = null
            sumNums[3] = null;
        }
        else {
            document.getElementById("four").disabled = false;
            if (ids) document.getElementById("four").innerHTML = findIndexInAll(evaluating[3])
            else { document.getElementById("four").innerHTML = evaluating[3].sum }
            sumNums[3] = evaluating[3];
            fourth = sumNums[3]
        }
        if (evaluating.length < 3) {
            document.getElementById("three").disabled = true;
            sumNums[2] = null;
            third = null
        }
        else {
            document.getElementById("three").disabled = false;
            if (ids) document.getElementById("three").innerHTML = findIndexInAll(evaluating[2])
            else { document.getElementById("three").innerHTML = evaluating[2].sum }
            sumNums[2] = evaluating[2];
            third = sumNums[2]
        }
        if (ids) document.getElementById("two").innerHTML = findIndexInAll(evaluating[2])
        else { document.getElementById("two").innerHTML = evaluating[1].sum }
        sumNums[1] = evaluating[1];
        second = sumNums[1]
        if (ids) document.getElementById("one").innerHTML = findIndexInAll(evaluating[0])
        else { document.getElementById("one").innerHTML = evaluating[0].sum }
        sumNums[0] = evaluating[0];
        first = sumNums[0]
    }
}


function submit()
{
    for (x of sumNums) 
    {
        if (x != null)
        {
            if (!currentItems.some(e => e.sum === x.sum))
            {
                let index
                for (y of survivors)
                {
                    if (y.sum == x.sum) index = survivors.indexOf(y)
                }
                survivors.splice(index, 1)
                eliminated.push({ "sum": x.sum, "eliminatedBy": [] })

            }
        }
    }
    let u = [...new Map(eliminated.map(v => [v.sum, v])).values()]
    eliminated = u
    for (x of eliminated)
    {
        for (y of currentItems)
        {
            x.eliminatedBy.push(y)
        }
        let u = [...new Map(x.eliminatedBy.map(v => [v.sum, v])).values()]
        x.eliminatedBy = u
    }
    document.getElementById("one").style.backgroundColor = "lightgray";
    document.getElementById("two").style.backgroundColor = "lightgray";
    document.getElementById("three").style.backgroundColor = "lightgray";
    document.getElementById("four").style.backgroundColor = "lightgray";
    
    currentItems = [];
    sumNums = []
    currentSelected = [];
    nextBatch();
    
}

function shuffle(array) {
    /**
     * Shuffles the given array to be in a random order.
     */
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function setup() {
timeStarted = Date.now()
    const urlParams = new URLSearchParams(window.location.search);
    key = urlParams.get("id")
    article = urlParams.get("article")
    getSummaries(fileNum);
    fetch('http://54.204.160.91/getArticle?id=' + key + "&article=" + article, {
        method: "post"
    }).then((response) => response.text()).then((data) => { document.getElementById("article").innerHTML = data; });

    

}

function getSummaries(fileNum) {
    let formData = new FormData()
    formData.append("fileNum", fileNum)
    fetch('http://54.204.160.91/getSummaries?id=' + key +"&article=" + article, {
        method: "post", body: formData
    }).then((response) => response.text()).then((data) => {
        data = JSON.parse(data)
       console.log(data)
        let values = Object.values(data).slice(1)
        for (x of values)
        {
            allSummaries.push(x.sum)
        }
        firstBatch()
    });
    
} 

function seeArticle()
{
    let article = document.getElementById("article")
    if (article.style.display == "block") {
        article.style.display = "none"
    }
    else
    {
        article.style.display = "block"
    }
}

function sendIn()
{
timeStopped = Date.now()
    let data = []
    let indexList = []
    console.log(allSummaries)
    for (x of ranked)
    {

        
        var index = findIndexInAll(x)
        indexList.push(index)
        console.log(index)
        data.push({ "sumNum": index })
    }
    for(let i = 0; i < 14; i++) 
{
    let ind = indexList.indexOf(i)
    if(ind === -1)  data.push({ "sumNum": i })
}
    let formData = new FormData;
    data.push({ "timeStarted": timeStarted })
    data.push({ "timeStopped": timeStopped })
    formData.append("data", JSON.stringify(data))
 formData.append("method", "elimSort")
    fetch('http://54.204.160.91/data?id=' + key + "&article=" + article, {
        method: "post",
        body: formData

    }).then((value) => { window.location.href = "http://54.204.160.91/dashboard?id=" + key });
    
}

function findIndexInAll(sum) 
{
   let index = 0;
for(s of allSummaries) 
{
    if(s=== sum.sum) return index;
index++
}
}
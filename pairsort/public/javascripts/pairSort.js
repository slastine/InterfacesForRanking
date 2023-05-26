let key;
let allData;
let fileNum = 1;

async function setup()
{
    const urlParams = new URLSearchParams(window.location.search);
    fetch('http://54.204.160.91/createKey', {
    }).then((response) => response.text()).then((data) => { key = data });
    let formData = new FormData()
    formData.append("fileNum", fileNum)
    fetch('http://54.204.160.91/getArticle', {
        method: "post", body: formData
    }).then((response) => response.text()).then((data) => { document.getElementById("article").innerHTML = data; });
   
    fetch('http://54.204.160.91/getSummaries?id=' + key, {
        method: "post", body: formData

    }).then((response) => response.text()).then(async function (data)
    {
        console.log(data)
        data = JSON.parse(data);
        for (var i = 0; i < data.length; i++) {

            // Last i elements are already in place  
            for (var j = 0; j < (data.length - i - 1); j++) {

                // Checking if the item at present iteration 
                // is greater than the next iteration
                //if (i + 1 != j)
                //{
                if (i + 1 != j) {
                    await compare(j, j + 1, fileNum, data).then((value) => {
                        if (value) {
                            var temp = data[j]
                            data[j] = data[j + 1]
                            data[j + 1] = temp
                        }
                    });
                }
                //}
            }
        }
        submit(data)
        });
           
            
    

}

async function compare(first, second, fileNum, set)
{
    console.log("Comparing " + set[first].sumNum+ " <b>with</b> " + set[second].sumNum)
    return new Promise(resolve => {
                    document.getElementById("firstSum").innerHTML = set[first].sum;

                   document.getElementById("secondSum").innerHTML = set[second].sum;

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
    
    let formData = new FormData()
    formData.append("data", JSON.stringify(data))
    fetch('http://54.204.160.91/data?id=' + key, {
        method: "post",
        body: formData

    }).then((value) => { document.write("Thank you for participating!") });
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

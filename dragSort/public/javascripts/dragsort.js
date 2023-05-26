let key;

let fileNum = 1;
async function setup() {
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

    }).then((response) => response.text()).then(async function (data) {

        console.log(data)
        data = JSON.parse(data);

        for (sum of data) {
            let item = document.createElement("div");
            item.id = ("name", "{'fileNum':" + fileNum + ", 'sumNum':" + sum.sumNum + "}");
            item.className = "item";
            item.innerHTML = sum.sum;

            list1.appendChild(item);
        }

    });

}



function submit()
{
    let list1 = document.getElementById("list1");

    let total = ""
    for (element of list1.children)
    {
        total += (element.id) + "\n"
    }

    let formData = new FormData()
    formData.append("data", total)
    fetch('http://54.204.160.91/data?id=' + key, {
        method: "post",
        body: formData

    });
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

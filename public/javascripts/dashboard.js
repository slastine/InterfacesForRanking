let key;

let fileNum = 1;
async function setup() {
    const urlParams = new URLSearchParams(window.location.search);
    key = urlParams.get("id")
    let formData = new FormData()
    formData.append("fileNum", fileNum)
    fetch('http://54.204.160.91/getTasks?id=' + key, {
        method: "post", body: formData

    }).then((response) => response.text()).then(async function (data) {

        console.log(data)
        data = JSON.parse(data);

        for (sum of data) {
            if (sum.completion == 0) {
                let item = document.createElement("div");
                let button = document.createElement("button");
                button.innerText = "Begin"
                button.className = "button"
                button.id = sum.article
                button.onclick = clickEventHandler
                let text = document.createElement("div")
                text.className = "text"
                item.id = ("name", "{'fileNum':" + fileNum + ", 'sumNum':" + sum.sumNum + "}");
                item.className = "item";
                text.innerHTML = sum.article;
                item.appendChild(text)
                item.appendChild(button)
                list1.appendChild(item);
            }
        }

    });

}

function clickEventHandler(event) {

    if (!event) {
        event = window.event; // Older versions of IE use 
        // a global reference 
        // and not an argument.
    };

    var el = (event.target || event.srcElement); // DOM uses 'target';
    // older versions of 
    // IE use 'srcElement'
    getNextPage(el.id)

}

async function getNextPage(article)
{
    fetch('http://54.204.160.91/getMethod?id=' + key, {
        method: "post"

    }).then((response) => response.text()).then(async function (data) {
        window.location.href = "http://54.204.160.91/" + data + "?article=" + article + "&id=" + key

    });
}



function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

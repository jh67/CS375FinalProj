let getItem = document.getElementById("item");
let getQuantity = document.getElementById("quantity");
let getPrice = document.getElementById("price");
let getName = document.getElementById("name");
let submitButton = document.getElementById("submit");
let messageBlock = document.getElementById("message");
let table = document.getElementById("table");

submitButton.addEventListener("click", function(){
    let listing = {
        item: getItem.value,
        quantity: getQuantity.value,
        price: getPrice.value,
        name: getName.value
    }
    console.log(listing);

    fetch("/newlisting", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(listing),
    }).then(function(response) {
        if(response.status === 200){
            messageBlock.textContent = "";
        }
        else {
            messageBlock.textContent = "Invalid Request; Please fill in appropriate fields";
        }
    }).catch(function (error) {
        console.log(error);
    })
});

document.addEventListener("DOMContentLoaded", function() {
    fetch("/getListings").then(function(response) {
        if (response.stats === 200) {
            messageBlock.textContent = "";
            updateTable(response.json());
        }
        else {
            messageBlock.textContent = "Error loading marketplace data"
        }
    }).catch(function (error) {
        console.log(error);
    })
});



function updateTable(data) {
    clearTable()
    for (let i = 0; i < data.item.length; i++) {
        let row = document.createElement("tr");
        let item = document.createElement("td");
        let price = document.createElement("td");
        let quant = document.createElement("td");
        let seller = document.createElement("td");

        item.textContent = data.item[i];
        quant.textContent = data.quantity[i];
        price.textContent = data.pricec[i];
        seller.textContent = data.seller[i];

        row.append(item);
        row.append(quant);
        row.append(price);
        row.append(seller);
        table.append(row);
    }
}

function clearTable() {
    while (table.children.length > 1) {
        table.children[1].remove();
    }
    if(errorPlace.children[0]) {
        errorPlace.children[0].remove();
    }
}

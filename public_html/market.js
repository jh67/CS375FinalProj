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
            updateTable();
        }
        else {
            messageBlock.textContent = "Invalid Request; Please fill in appropriate fields";
        }
    }).catch(function (error) {
        console.log(error);
    })
});

document.addEventListener("DOMContentLoaded", updateTable);

function updateTable() {
    clearTable()
    fetch("/getListings").then(function(response) {
        if (response.status === 200) {
            messageBlock.textContent = "";
            return response.json();
        }
        else {
            messageBlock.textContent = "Error loading marketplace data"
        }
    }).then(function (data) {
        if(!data.rows.length)
            return
        else {
            for (let i = 0; i < data.rows.length; i++) {
                let row = document.createElement("tr");
                let item = document.createElement("td");
                let price = document.createElement("td");
                let quant = document.createElement("td");
                let seller = document.createElement("td");
                
                item.textContent = data.rows[i].item;
                quant.textContent = data.rows[i].quantity;
                price.textContent = data.rows[i].price;
                seller.textContent = data.rows[i].name;

                row.append(item);
                row.append(quant);
                row.append(price);
                row.append(seller);
                table.append(row);
            }
        }
    }).catch(function (error) {
        console.log(error);
    })
});

}

function clearTable() {
    while (table.children.length > 1) {
        table.children[1].remove();
    }
}

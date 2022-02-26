let getItem = document.getElementById("item");
let getQuantity = document.getElementById("quantity");
let getPrice = document.getElementById("price");
let getName = document.getElementById("name");
let submitButton = document.getElementById("submit");
let messageBlock = document.getElementById("message");

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
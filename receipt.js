//Lambert and Richard
$(document).ready(function()
{
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    
    //retrives information from localstorage about the order
    let order = JSON.parse(localStorage.getItem('orderDetails'));
    let orderedSeats = JSON.parse(localStorage.getItem('lastOrder'));

    //makes calculations and determines the values
    let subTotal = order.subtotal;    
    let discount = order.discount;
    let tax = (subTotal-discount) * 0.1;
    let finalPrice = subTotal - discount + tax;
    tableGenerator();
    updatePrices();
    
    //sets various elements in the html to information found in localstorage
    function updatePrices() 
    {
        document.getElementById("date").innerHTML = order.date;
        document.getElementById("customer-name").innerHTML = order.name;
        document.getElementById("sub-total").innerHTML = formatter.format(subTotal);
        document.getElementById("tax").innerHTML = formatter.format(tax);
        document.getElementById("discount-price").innerHTML = "-" + formatter.format(discount);
        document.querySelectorAll("#total-price")[0].innerHTML = formatter.format(finalPrice);
        document.querySelectorAll("#total-price")[1].innerHTML = formatter.format(finalPrice);
    }
    
    //runs a loop through the array from localstorage and makes a table with information 
    //from the loop's objects
    function tableGenerator() 
    {
        let s = "<table id = 'cartContent'>"
        for (let p = 0; p < orderedSeats.length; p++) {
            s += "<tr class='tableRow tableElement'>"
            s += "<td class='tableElement col-num'>" + orderedSeats[p].location + "</td>"
            s += "<td class='tableElement col-price'>" + "$" + orderedSeats[p].price + "</td>"
            s += "<td class='tableElement col-class " + orderedSeats[p].htmlclass + "'>" + 
                orderedSeats[p].class + "</td>"
        }
        s += "</table>"
        document.getElementById('receipt-content').innerHTML = s;
    }
})
function returnPage() //changes the window location to the main html page
{
    window.location.href = "index.html";
}
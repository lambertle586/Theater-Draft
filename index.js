//Richard and Lambert
let cart = [];
let totalPrice = 0;
let currentTime = new Date();
let date = String((currentTime.getMonth() + 1) + "/" + currentTime.getDate() 
    + "/" + currentTime.getFullYear());
let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

/*the functions are called once the page is loaded to prevent queryselectors returning null*/
$(document).ready(function() 
{
    populateUI();
    addOnClick();
})

/*adds functions that activate via onclick onto the table cells (seats) and the keyboxes*/
function addOnClick() 
{
    let allseats = document.getElementsByTagName("td")
    for (let i = 0; i < allseats.length; i++) {

        /*adds to every seat except for occupied seats and keyboxes*/
        allseats[i].addEventListener('click', (e) => { 
            if ((e.target.classList.contains('seat1') || e.target.classList.contains('seat2') ||
                e.target.classList.contains('seat3') || e.target.classList.contains('seat4')) && 
                !e.target.classList.contains('occupied')) {

                let firstContainedClass = e.target.classList[0];
                let hasSelected = e.target.classList.contains('selected');
                let numberinside = e.target.textContent;
                
                //calls to addtocart with parameters containing the first class in the classlist, 
                //a boolean, and the textcontent of the target
                addToCart(firstContainedClass, hasSelected, numberinside); 
                
                //if the seat does not contain the class 'selected' then it will be added, 
                //if it does, then the function removefromuiandcart will be called   
                if (!e.target.classList.contains('selected'))           
                    e.target.classList.add('selected')                             
                else
                    removeFromUIandCart(e.target.textContent);
            }
        })
    }
    
    /*calls to keylight on every keybox*/
    let keyboxes = document.querySelectorAll(".keybox") 
    for (let i = 0; i < keyboxes.length; i++) {
        keyboxes[i].addEventListener('click', (e) => {
            keyHighlight(e.target.classList[0])
        }
        )
    }
}

//toggles the class 'highlight' to every seat with a class with the same name as the parameter
function keyHighlight(seatclass) 
{
    let seats = document.getElementsByClassName(seatclass);
    for(let k = 0; k < seats.length; k++)
        seats[k].classList.toggle('highlight');
}

//finds the index of the target seat in the pool of all seats and sends it to 
//the function removefromcart
function removeFromUIandCart(target) 
{
    let targetIndex = 0;
    let allSeats = document.querySelectorAll('.selected')
    allSeats.forEach((element, i) => {
        if (element.textContent === target) {
            targetIndex = i;
        }
    })
    removeFromCart(targetIndex);
                
}

//removes the class 'selected' from the seat at the index provided, reduces the price 
//accordingly, removes the seat from the cart array
function removeFromCart(index) 
{
    document.querySelectorAll('.selected')[index].classList.remove('selected')
    totalPrice -= cart[index].price;
    cart.splice(index,1);
    visualCartUpdate();
}

//if the boolean representing if the seat is occupied is false, then the clicked seat will 
//be added as an object to the cart array and the totalprice increases
function addToCart(targetSeatClass,targetSeatStatus,targetSeatNumber) 
{
    if(targetSeatStatus === false)
    {
        let addedPrice = 0;
        seatClass = "";
        if(targetSeatClass === "seat1")
        {   
            addedPrice = 50
            seatClass = "First Class"
        }
        else if(targetSeatClass === "seat2")
        {
            addedPrice = 40
            seatClass = "Second Class"
        }
        else if(targetSeatClass === "seat3")
        {
            addedPrice = 30
            seatClass = "Third Class"
        }

        else if(targetSeatClass === "seat4")
        {
            addedPrice = 25
            seatClass = "Fourth Class"
        }

        let oneSeat = {
            location:targetSeatNumber,
            price:addedPrice,
            class:seatClass,
            htmlclass:targetSeatClass
        }
        cart.push(oneSeat);
        totalPrice += addedPrice;
    }
    visualCartUpdate();
}

//generates a table by running through the cart array and replaces the innerhtml of 
//a <p></p> tag in the html with the table
function visualCartUpdate() 
{
    let string = "<table id = 'cartContent'>"
    for(let p = 0; p<cart.length; p++)
    {
        string += "<tr class='row tableElement'>"
        string += "<td class='tableElement'>" + cart[p].location + "</td>"
        string += "<td class='tableElement'>" + "$"+cart[p].price + "</td>"
        string += "<td class='tableElement " + cart[p].htmlclass + "'>" + cart[p].class + "</td>"
        string += "<td class='tableElement'><button type = button id = 'removeRowBtn' "
        string += "onclick=removeFromCart(" + p + ")>Remove</button></td>"
    }
    string += "</table>"
    document.getElementById('text').innerHTML = string
    document.getElementById('subTotalDisplay').value = "$" + totalPrice + ".00"
}

//activates via a button being clicked from the html
function purchase() 
{
    let occupiedSeats = document.querySelectorAll('.selected,.occupied:not(.keybox)');
    let allSeats = document.querySelectorAll(
        '.seat1:not(.keybox),.seat2:not(.keybox),.seat3:not(.keybox),.seat4:not(.keybox)')
    
    //returns an array of the indexes of occupied seats
    let occupiedIndexes = [...occupiedSeats].map(function(element) { 
        return [...allSeats].indexOf(element);
    })
    
    //stores the indexes of occupied seats to the localstorage
    localStorage.setItem('occupiedSeats', JSON.stringify(occupiedIndexes)); 

    //stores the cart of the lastest purchase to localstorage
    localStorage.setItem('lastOrder', JSON.stringify(cart)); 
    receiptHandler();
    
    //if the function returns true then the html, totalprice, cart,
    //and visual appearance will be reset with the exception of the occupied 
    //seats which will stay black
    if(failSafe(document.getElementById("InpName").value)) 
    {
        cart = [];
        totalPrice = 0;
        populateUI();
        visualCartUpdate();
        totalSalesHandler();
        window.location.href = "receipt.html";
    }
}

//pulls the indexes of the occupied seats from localstorage and runs 
//a loop that adds the class 'occupied' to the indexes
function populateUI() 
{
    let seats = document.querySelectorAll(
        '.seat1:not(.keybox),.seat2:not(.keybox),.seat3:not(.keybox),.seat4:not(.keybox)');
    let occupiedSeats = JSON.parse(localStorage.getItem('occupiedSeats'));
    if(occupiedSeats !== null && occupiedSeats.length > 0)
    {
        seats.forEach((element,i) => {
            if(occupiedSeats.indexOf(i) > -1)
            {
                element.classList.add('occupied');
                element.classList.remove('selected');
            }
        })
    }
}

//adds the details of the order to localstorage for use with the receipt
function receiptHandler() 
{
    let customerName = document.getElementById("InpName").value;
    let discount = discountHandler();

    let order = {
        name:customerName,
        subtotal:totalPrice,
        discount:discount,
        date:date,
    }
    localStorage.setItem('orderDetails',JSON.stringify(order))
}

//uses if statements to determine the discount
let discountHandler = function() 
{
    let discountCode = String(document.getElementById("InpDiscount").value);
    let discountPrice = 0;
    if(discountCode === "hello")
        discountPrice = totalPrice * 0.1;
    else if(discountCode === "richandrich")
        discountPrice = totalPrice * 0.2;
    else if(discountCode === "nhat")
        discountPrice = totalPrice * 0.3;
    return discountPrice;
}

//uses if statements to stop progression if there is not a name or the price has not increased, 
//meaning that there are no seats selected
function failSafe(customername) 
{
    let fs = true;
    if(!customername.length > 0)
    {
        alert("Please Enter a Name");
        fs = false;
    }
    if(!totalPrice > 0)
    {
        alert("Please Choose Seats");
        fs = false;
    }
    return fs;  
}

//takes information of the totalsales from localstorage and adds on the total from the latest order
function totalSalesHandler() 
{
    let sales = JSON.parse(localStorage.getItem('totalSales'))
    let order = JSON.parse(localStorage.getItem('orderDetails'))
    let subTotal = order.subtotal;
    let discount = order.discount;
    let tax = (subTotal - discount) * 0.1;
    let finalPrice = subTotal - discount + tax;
    if(sales !== null)
    {
        let totalSales = sales + finalPrice;
        localStorage.setItem('totalSales', JSON.stringify(totalSales));
    }
    else if(sales === null)
        localStorage.setItem('totalSales', JSON.stringify(finalPrice));
    
}

//acquires information from localstorage and the html to display information in the report, 
//activated via button click
function reportHandler() 
{
    let numSeatsSold = document.querySelectorAll('.occupied:not(.keybox)').length;
    let totalSeats = document.querySelectorAll(
        '.seat1:not(.keybox),.seat2:not(.keybox),.seat3:not(.keybox),.seat4:not(.keybox)').length;
    let sales = JSON.parse(localStorage.getItem('totalSales'));
    if(sales === null)
    {
        sales = 0;
    }
    let string = "";
    string += "Production Cost: $300\n"
    string += "Total Sales: " + formatter.format(sales) + "\n";
    string += "Seats Sold: " + numSeatsSold + "\n";
    string += "Seats Available: " + (totalSeats-numSeatsSold) + "\n";
    if(sales > 300)
    string += "We have $0 in losses and " + formatter.format(sales - 300) + " in profit"
    else if(sales == 300)
    string += "We have $0 in losses and $0 in profit"
    else if(sales < 300)
    string += "We have " + formatter.format(300 - sales) + " in losses and $0 in profit"
    alert(string);
}
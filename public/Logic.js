document.addEventListener("click", function(event) {
    // Check if the click is not in the shop section
    const shopSection = document.getElementById("shop"); // Assuming your shop section has an ID of "shop"

    if (!shopSection.contains(event.target)) {
        updateapartmentscounter();
        updatemoney();
    }
});

let apartmentscounter = 0;

function updateapartmentscounter() {
    apartmentscounter++;
    document.getElementById("apartmentscounter").textContent = apartmentscounter;
}

let moneycounter = 0;
let moneymore = 10;

function updatemoney() {
    moneycounter += moneymore;
    document.getElementById("moneycounter").textContent = moneycounter;
}
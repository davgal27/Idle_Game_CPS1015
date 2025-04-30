//START BUTTON LOGIC (Title screen, konkos animation, music)
const TitleScreen = document.getElementById("title_screen");
const StartButton = document.getElementById("start-button");
const TitleImage = document.getElementById("title-img");


TitleImage.style.visibility = 'hidden';
//MUSIC 
const landing = new Audio("assets/sounds/landing.mp3");
const music1 = new Audio("assets/sounds/music1.mp3"); // Dbg
const music2 = new Audio("assets/sounds/music2.mp3"); // Dayx


const MusicList = [music1, music2];
let CurrentTrack = 0; //0 is music 1 , 1 is 2 etc 

function PlayNextMusic(){
    if (CurrentTrack >= MusicList.length) {
        CurrentTrack = 0;
    }
    MusicList[CurrentTrack].play();
    CurrentTrack++;
}
//start button
StartButton.addEventListener("click", () => { // WHEN CLICK ON START BUTTON, DO:

    TitleImage.style.visibility = 'hidden';
    TitleScreen.style.transition = "opacity 1s";
    TitleScreen.style.opacity = "0";

    setTimeout(() => { // fading title screen
        TitleScreen.style.display = "none";
    }, 1000);
    
    setTimeout(() => { // making konkos fall and shake (mimicking superhero effect)
        TitleImage.style.visibility = 'visible'; 
        TitleImage.style.animation = 'shootDown 0.5s ease-out forwards';
        TitleImage.style.animationDelay = '0s';
        landing.play(); // bowser landing sound
    }, 2000); 
    
    setTimeout(() => {
        TitleImage.style.animation = 'shake 0.2s ease forwards'; // shake
    }, 2400);
    setTimeout( () =>{ // dbg to start 
        PlayNextMusic();
    }, 4000)
});

// MUTE BUTTON LOGIC 

//BUILD BUTTON LOGIC (Counters for Apt, money,  apt/click)
// RESOURCES
let ApartmentsCount = 0;
let MoneyCount = 0;
let BuilderCount = 0;

// OTHER COUNTERS
let AptPerClick = 1;
let MoneyPerApt = 1;
let BuilderMultiplier = 1;

// UPGRADE COSTS
let IncreaseApartmentSizeCost = 100;
let UpgradeClickerCost = 150;
let HireBuilderCost = 200;
let DealWithPoliticianCost = 1117;

//TIMED EVENT
let event = false;
let cooldown = false;

// GETTING STUFF FROM HTML:
// COUNTERS
const ApartmentsCountElement = document.getElementById("apartments-count");
const MoneyCountElement = document.getElementById("money-count");
const BuilderCountElement = document.getElementById("builders-count");
const MoneyPerAptElement = document.getElementById("moneyperapartment-count");
const AptPerClickElement = document.getElementById("apartmentperclick-count");
// UPGRADES
const HireBuilderCostElement = document.getElementById("builder-cost");
const IncreaseApartmentSizeCostElement = document.getElementById("apartment-cost");
const UpgradeClickerCostElement = document.getElementById("clickupgrade-cost");
const DealWithPoliticianCostElement = document.getElementById("politician-cost");

// UPDATING HTML TEXT CONTENT (the  counter spans)
function UpdateCounters() {
    //COUNTERS
    ApartmentsCountElement.textContent = ApartmentsCount;
    MoneyCountElement.textContent = MoneyCount;
    MoneyPerAptElement.textContent = MoneyPerApt;
    AptPerClickElement.textContent = AptPerClick;
    //timed event logic for updating during the event (broke with other methods)
    if (event) {
        BuilderCountElement.textContent = `${BuilderCount} ×${BuilderMultiplier}!`;
    } else {
        BuilderCountElement.textContent = BuilderCount;
    }
    //UPGRADES
    HireBuilderCostElement.textContent = HireBuilderCost;
    IncreaseApartmentSizeCostElement.textContent = IncreaseApartmentSizeCost;
    UpgradeClickerCostElement.textContent = UpgradeClickerCost;
    DealWithPoliticianCostElement.textContent = DealWithPoliticianCost; //timed event 
}

function BuildWithClick(){ // building an apartment with a click
    BuildApartment(AptPerClick);
}
function BuildApartment(amount){
    ApartmentsCount += amount;
    MoneyCount += MoneyPerApt * amount;
    UpdateCounters();
}

// UPGRADE LOGIC (Counters + upgrade buttons + timed event)

function IncreaseApartmentSize() {
    if (MoneyCount >= IncreaseApartmentSizeCost) {
        MoneyCount -= IncreaseApartmentSizeCost;
        MoneyPerApt += 1;
        IncreaseApartmentSizeCost = Math.floor(IncreaseApartmentSizeCost * 1.05);
        UpdateCounters();
    }
}
function UpgradeClick() {
    if (MoneyCount >= UpgradeClickerCost) {
        MoneyCount -= UpgradeClickerCost;
        AptPerClick += 1;
        UpgradeClickerCost = Math.floor(UpgradeClickerCost * 1.05);
        UpdateCounters();
    }
}
function HireBuilder() {
    if (MoneyCount >= HireBuilderCost) {
        MoneyCount -= HireBuilderCost;
        BuilderCount += 1;
        HireBuilderCost = Math.floor(HireBuilderCost * 1.05);
        UpdateCounters();
    }
}
setInterval(() => {
    BuildApartment(BuilderCount * BuilderMultiplier);// Each builder builds 1 apartment
    UpdateCounters();
}, 1000);

function DealWithPolitician() {
    if (MoneyCount >= DealWithPoliticianCost && !event && !cooldown) {
        MoneyCount -= DealWithPoliticianCost;
        DealWithPoliticianCost = Math.floor(DealWithPoliticianCost * 1.2);
        event = true;
        BuilderMultiplier = 10;

        setTimeout(() => {
            BuilderMultiplier = 1;
            event = false;

            cooldown = true;
            setTimeout(() => {
                cooldown = false;
            }, 60000);
        }, 30000);

        UpdateCounters();
    }
}
// ACHIEVEMENT LOGIC (Counters + achievement unlocks + Popups)

//START BUTTON LOGIC (Title screen, konkos animation, music)
const TitleScreen = document.getElementById("title_screen");
const StartButton = document.getElementById("start-button");
const TitleImage = document.getElementById("title-img");


TitleImage.style.visibility = 'hidden';
//SONGS LIST 
const landing = new Audio("assets/sounds/landing.mp3"); // bowser landing sound
const music1 = new Audio("assets/sounds/music1.mp3"); // Death By Glamour 8bit- 8bit universe remix
const music2 = new Audio("assets/sounds/music2.mp3"); // Digestive Biscuit - Kubbi
const music3 = new Audio("assets/sounds/music3.mp3"); // The Secret - DaXX
const music4 = new Audio("assets/sounds/music4.mp3"); //Get up n' fight - nexscard
// STARTING MUSIC LOGIC
const MusicList = [music2, music4, music3, music1];
let CurrentTrack = 0; //0 is music 1 , 1 is 2 etc 

// MUTE BUTTON LOGIC 
let IsMuted = false;
const MuteButton = document.getElementById("MuteButton");
let CurrentTimeOfSong = 0; // Would not have figured this out without AI 

MuteButton.addEventListener("click", ()=> {
    IsMuted = !IsMuted;

    if (IsMuted){
        CurrentTimeOfSong = MusicList[CurrentTrack].currentTime;
        MusicList.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        })
    } else {
        MusicList[CurrentTrack].currentTime = CurrentTimeOfSong;
        MusicList[CurrentTrack].play();
        PlayNextMusic();
    }
})
// PLAYING THE MUSIC 
function PlayNextMusic(){
    if (CurrentTrack >= MusicList.length) {
        CurrentTrack = 0;
    }
    if (!IsMuted) {
        MusicList[CurrentTrack].play();
        MusicList[CurrentTrack].onended = () => {
            CurrentTrack++;
            PlayNextMusic();
        };
    }
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
    }, 1500)
});

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
let DealWithPoliticianCost = 197;

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
    CheckAchievements();
}

// UPGRADE LOGIC (Counters + upgrade buttons + timed event)

function IncreaseApartmentSize() {
    if (MoneyCount >= IncreaseApartmentSizeCost) {
        MoneyCount -= IncreaseApartmentSizeCost;
        MoneyPerApt += 1;
        IncreaseApartmentSizeCost = Math.floor(IncreaseApartmentSizeCost * 1.05);
        UpdateCounters();
        CheckAchievements();
    }
}
function UpgradeClick() {
    if (MoneyCount >= UpgradeClickerCost) {
        MoneyCount -= UpgradeClickerCost;
        AptPerClick += 1;
        UpgradeClickerCost = Math.floor(UpgradeClickerCost * 1.05);
        UpdateCounters();
        CheckAchievements();
    }
}
function HireBuilder() {
    if (MoneyCount >= HireBuilderCost) {
        MoneyCount -= HireBuilderCost;
        BuilderCount += 1;
        HireBuilderCost = Math.floor(HireBuilderCost * 1.05);
        UpdateCounters();
        CheckAchievements();
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
        CheckAchievements();
    }
}

// ACHIEVEMENT LOGIC (Counters + achievement unlocks + Popups)

const achievements = [
    { name: "Not Again!", threshold: 10, counter: () => ApartmentsCount, unlocked: false },
    { name: "Houses are Old School", threshold: 10000, counter: () => ApartmentsCount, unlocked: false },
    { name: "Concrete Over Country", threshold: 100000, counter: () => ApartmentsCount, unlocked: false },
    { name: "Who's Living in These??", threshold: 500000, counter: () => ApartmentsCount, unlocked: false },
    { name: "Pocket Money", threshold: 500000, counter: () => MoneyCount, unlocked: false },
    { name: "Have You Considered Charity?", threshold: 5000000, counter: () => MoneyCount, unlocked: false },
    { name: "PLEASE Consider Charity", threshold: 50000000, counter: () => MoneyCount, unlocked: false },
    { name: "Kick Back and Relax", threshold: 1, counter: () => BuilderCount, unlocked: false },
    { name: "We’re Going to Need More Trucks", threshold: 100, counter: () => BuilderCount, unlocked: false },
    { name: "At Least You're Creating Jobs", threshold: 1000, counter: () => BuilderCount, unlocked: false },
    { name: "Not What You Know but Who You Know", threshold: 2, counter: () => event ? 1 : 0, unlocked: false } // timed event
];

function CheckAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.counter() >= achievement.threshold) {
            UnlockAchievement(achievement); //calling function to unlock achievement
        }
    });
}

function UnlockAchievement(achievement) {
    achievement.unlocked = true;
    const AchievementElements = document.querySelectorAll('.achievement-name');
    AchievementElements.forEach(element => {
        if (element.textContent.includes(achievement.name)) {
            const AchievementItem = element.closest('.achievement-item');
            AchievementItem.classList.add('unlocked'); 
        }
    });

    //Popup
    const AchievementPopup = document.createElement('div');
    AchievementPopup.classList.add('achievement-popup');
    AchievementPopup.textContent = `Achievement unlocked: ${achievement.name}`;
    document.body.appendChild(AchievementPopup);


    setTimeout(() => {
        AchievementPopup.remove();
    }, 3000);
}